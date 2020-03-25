import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { authenticator } from 'otplib/otplib-browser';
import { NEVER, Observable, Subject, forkJoin, of, timer } from 'rxjs';
import {
  catchError, endWith, finalize, first, map, mergeMap, pluck, scan,
  shareReplay, startWith, switchMap, takeUntil, tap,
} from 'rxjs/operators';

import {
  AttendanceGQL, AttendanceQuery, InitAttendanceGQL, InitAttendanceMutation,
  MarkAttendanceGQL, MarkAttendanceMutation, NewStatusGQL,
  NewStatusSubscription, ResetAttendanceGQL, SaveLectureLogGQL, ScheduleInput,
  Status
} from '../../../../generated/graphql';
import { isoDate, parseTime } from '../date';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.page.html',
  styleUrls: ['./mark-attendance.page.scss'],
})
export class MarkAttendancePage implements OnInit {

  schedule: ScheduleInput;

  auto: boolean;
  term = '';
  type: 'Y' | 'L' | 'N' | 'R' | '';
  resetable = false;

  lectureUpdate = '';

  otp$: Observable<number>;
  lastMarked$: Observable<Pick<NewStatusSubscription, 'newStatus'>[]>;
  students$: Observable<Partial<Status>[]>;
  totalPresentStudents$: Observable<number>;
  totalStudents$: Observable<number>;

  statusUpdate = new Subject<{ id: string; attendance: string; absentReason: string | null; }>();

  constructor(
    private attendance: AttendanceGQL,
    private initAttendance: InitAttendanceGQL,
    private location: Location,
    private markAttendance: MarkAttendanceGQL,
    private newStatus: NewStatusGQL,
    private resetAttendance: ResetAttendanceGQL,
    private route: ActivatedRoute,
    private saveLectureLog: SaveLectureLogGQL,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    // totp options
    authenticator.options = { digits: 3 };

    const schedule = this.schedule = {
      classcode: this.route.snapshot.paramMap.get('classcode'),
      date: this.route.snapshot.paramMap.get('date'),
      startTime: this.route.snapshot.paramMap.get('startTime'),
      endTime: this.route.snapshot.paramMap.get('endTime'),
      classType: this.route.snapshot.paramMap.get('classType')
    };
    let studentsNameById: { [student: string]: string };

    // limit reset to 30 days in the past
    const today = new Date(new Date().setHours(8, 0, 0, 0));
    const limit = new Date(today).setDate(today.getDate() - 30);
    this.resetable = limit <= Date.parse(schedule.date);

    // initAttendance and attendance query order based on probability
    const d = new Date();
    const nowMins = d.getHours() * 60 + d.getMinutes();
    // should be start <= now <= end + 5 but can ignore this because of classes page
    const thisClass = schedule.date === isoDate(today) && nowMins <= parseTime(schedule.endTime) + 5;
    const init = () => (this.auto = thisClass, this.type = 'N', this.initAttendance.mutate({ schedule }));
    const list = () => (this.auto = false, this.type = '', this.attendance.fetch({ schedule }));
    const attendance$ = thisClass ? init().pipe(catchError(list)) : list().pipe(catchError(init));

    // get attendance state from query and use manual mode if attendance initialized
    const attendancesState$ = attendance$.pipe(
      catchError(err => {
        this.toast('Failed to mark attendance: ' + err.message.replace('GraphQL error: ', ''), 'danger');
        console.error(err);
        return NEVER;
      }),
      pluck('data'),
      tap((query: AttendanceQuery | InitAttendanceMutation) => {
        studentsNameById = query.attendance.students.reduce((acc, s) => (acc[s.id] = s, acc), {});
      }),
      tap((query: AttendanceQuery) => {
        if (query.attendance.log) {
          this.lectureUpdate = query.attendance.log.lectureUpdate;
        }
      }),
    );

    // keep updating attendancesState$ with new changes
    const attendances$ = attendancesState$.pipe(
      switchMap(state => this.statusUpdate.asObservable().pipe(startWith(state))),
      scan((state: InitAttendanceMutation, action: { id: string; attendance: string; absentReason: string; }) => {
        const student = state.attendance.students.find(s => s.id === action.id);
        student.attendance = action.attendance;
        student.absentReason = action.absentReason;
        return state;
      }),
      shareReplay(1) // keep track while switching mode
    );

    const secret$ = attendances$.pipe(
      pluck('attendance', 'secret'),
      shareReplay(1) // used shareReplay for observable subscriptions time gap
    );

    // only regenerate otp when needed until class ends with 5 minutes buffer
    const hh = +schedule.endTime.slice(0, 2) % 12 + (schedule.endTime.slice(-2) === 'PM' ? 12 : 0);
    const mm = +schedule.endTime.slice(3, 5) + 5;
    this.otp$ = secret$.pipe(
      switchMap(secret =>
        timer(authenticator.timeRemaining() * 1000, authenticator.options.step * 1000).pipe(
          takeUntil(timer(new Date(schedule.date).setHours(hh, mm) - new Date().getTime())),
          startWith(() => authenticator.generate(secret)),
          map(() => authenticator.generate(secret)),
          endWith('---')
        )
      )
    );

    // take last 10 values updated and ignore duplicates
    console.log('schedule', schedule);
    this.lastMarked$ = this.newStatus.subscribe(schedule).pipe(
      pluck('data', 'newStatus'),
      tap(({ id }) => console.log('new', id, studentsNameById[id])),
      tap(({ id, attendance, absentReason }) => this.statusUpdate.next({ id, attendance, absentReason })),
      scan((acc, { id }) => acc.includes(studentsNameById[id])
        ? acc : [...acc, studentsNameById[id]].slice(-10), []),
      shareReplay(1) // keep track when enter manual mode
    );

    this.students$ = attendances$.pipe(
      pluck('attendance', 'students'),
      shareReplay(1)
    );

    this.totalPresentStudents$ = this.students$.pipe(
      map(students => students.filter(student => student.attendance === 'Y').length)
    );

    this.totalStudents$ = this.students$.pipe(
      map(students => students.length),
      first() // total does not change so stop counting
    );
  }

  /** Generate mark attendance subscription. */
  private _mark(
    student: string,
    attendance: string,
    absentReason: string = null,
  ): Observable<MarkAttendanceMutation> {
    // fallback to absent if reason is left empty
    if (attendance === 'R' && absentReason === null) {
      attendance = 'N';
    }

    // TODO: optimistic ui does not work yet
    const options = {
      optimisticResponse: {
        __typename: 'Mutation' as 'Mutation',
        markAttendance: {
          __typename: 'Status' as 'Status',
          id: student,
          attendance,
          absentReason,
          ...this.schedule
        }
      }
    };
    const schedule = this.schedule;
    return this.markAttendance.mutate({ schedule, student, attendance, absentReason }, options);
  }

  /** Mark all student as present. */
  markAllPresent() {
    this.loadingCtrl.create({ message: 'Updating' }).then(loading => {
      loading.present();
      this.students$.pipe(
        // run for all students at the same time and wait
        mergeMap(students => forkJoin([...students
          .filter(({ attendance }) => attendance !== 'Y')
          .map(({ id }) => this._mark(id, 'Y')),
          of(null) // complete observable if all already present
        ])),
        finalize(() => loading.dismiss()),
        first() // stop running once this is done
      ).subscribe(
        () => this.toast('Marked all present', 'success'),
        e => { this.toast('Mark all present failed: ' + e, 'danger'); console.error(e); },
      );
    });
  }

  /** Mark student attendance. */
  mark(student: string, attendance: string, absentEvent?: KeyboardEvent) {
    const el = absentEvent && absentEvent.target as HTMLInputElement;
    if (el) {
      el.blur();
    }
    const absentReason = el && el.value || null;
    this._mark(student, attendance, absentReason).subscribe(
      () => {},
      e => console.error(e)
    );
  }

  /** Save lecture update notes. */
  save(lectureUpdate: string) {
    const schedule = this.schedule;
    this.saveLectureLog.mutate({ schedule, log: { lectureUpdate } }).subscribe(
      () => this.toast('Lecture update saved', 'success'),
      e => { this.toast('Lecture update failed: ' + e, 'danger'); console.error(e); }
    );
  }

  /** Reset attendance, double confirm. */
  reset() {
    this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Attendance will be <strong>deleted</strong>!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Okay',
          handler: () => {
            const schedule = this.schedule;
            this.resetAttendance.mutate({ schedule }).subscribe(
              () => { this.toast('Attendance deleted', 'success'), this.location.back(); },
              e => { this.toast('Attendance delete failed: ' + e, 'danger'); console.error(e); }
            );
          }
        }
      ]
    }).then(alert => alert.present());
  }

  /** Helper function to toast error message. */
  toast(message: string, color: string) {
    this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      color
    }).then(toast => toast.present());
  }

  trackById(_index: number, item: Pick<Status, 'id'>) {
    return item.id;
  }

}
