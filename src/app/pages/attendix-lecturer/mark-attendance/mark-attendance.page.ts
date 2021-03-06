import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { authenticator } from 'otplib/otplib-browser';
import { NEVER, Observable, Subject, interval, timer } from 'rxjs';
import {
  catchError, endWith, filter, first, map, pluck, scan, share, shareReplay,
  startWith, switchMap, takeUntil, tap,
} from 'rxjs/operators';

import {
  AttendanceGQL, AttendanceQuery, InitAttendanceGQL, InitAttendanceMutation,
  MarkAttendanceAllGQL, MarkAttendanceGQL, NewStatusGQL, NewStatusSubscription,
  ResetAttendanceGQL, SaveLectureLogGQL, ScheduleInput, Status
} from '../../../../generated/graphql';
import { isoDate, parseTime } from '../date';

type Attendance = 'Y' | 'L' | 'N' | 'R' | '';

const stateMap = {Y: 'present', L: 'late', N: 'absent', R: 'absent with reason'};

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
  type: Attendance;
  resetable = false;

  lectureUpdate = '';

  countdown$: Observable<number>;
  timeLeft$: Observable<number>;
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
    private markAttendanceAll: MarkAttendanceAllGQL,
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

    this.schedule = {
      classcode: this.route.snapshot.paramMap.get('classcode'),
      date: this.route.snapshot.paramMap.get('date'),
      startTime: this.route.snapshot.paramMap.get('startTime'),
      endTime: this.route.snapshot.paramMap.get('endTime'),
      classType: this.route.snapshot.paramMap.get('classType')
    };

    const schedule = this.schedule;
    let studentsNameById: { [student: string]: string };

    // limit reset to 30 days in the past
    const today = new Date(new Date().setHours(8, 0, 0, 0));
    const limit = new Date(today).setDate(today.getDate() - 30);
    this.resetable = limit <= Date.parse(schedule.date);

    // initAttendance and attendance query order based on probability
    const d = new Date();
    const nowMins = d.getHours() * 60 + d.getMinutes();
    // should be start <= now <= end + 5 but can ignore this because of classes page
    const thisClass = schedule.date === isoDate(today) && parseTime(schedule.startTime) <= nowMins;

    const init = () => {
      const attendance = this.route.snapshot.paramMap.get('defaultAttendance') || 'N';
      this.auto = thisClass;
      this.type = 'N';
      return this.initAttendance.mutate({ schedule, attendance });
    };
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

    // stop timer until class ends with 5 minutes buffer
    const hh = +schedule.endTime.slice(0, 2) % 12 + (schedule.endTime.slice(-2) === 'PM' ? 12 : 0);
    const mm = +schedule.endTime.slice(3, 5) + 5;
    const stopTimer$ = timer(new Date(schedule.date).setHours(hh, mm) - new Date().getTime());
    const reload$ = timer(authenticator.timeRemaining() * 1000, authenticator.options.step * 1000).pipe(
      takeUntil(stopTimer$),
      share()
      // shareReplay(1) // XXX this should use share but why is there a time gap?
    );

    // display countdown timer
    this.timeLeft$ = reload$.pipe(
      startWith(() => Date.now() + (authenticator.timeRemaining() + 30) * 1000),
      map(() => Date.now() + (authenticator.timeRemaining() + 30) * 1000),
      shareReplay(1) // keep track while switching mode
    );
    this.countdown$ = interval(1000).pipe(
      takeUntil(stopTimer$),
      map(() => authenticator.timeRemaining() + 29), // ignore current second
      shareReplay(1) // keep track while switching mode
    );

    // only regenerate otp when needed during class
    this.otp$ = secret$.pipe(
      switchMap(secret =>
        reload$.pipe(
          startWith(() => null), // start immediately
          map(() => authenticator.generate(secret)),
          endWith('---')
        )
      ),
      shareReplay(1) // keep track while switching mode
    );

    // take last 10 values updated and ignore duplicates
    console.log('schedule', schedule);
    this.lastMarked$ = this.newStatus.subscribe(schedule).pipe(
      pluck('data', 'newStatus'),
      tap(({ id }) => console.log('new', id, studentsNameById[id])),
      tap(({ id, attendance, absentReason }) => this.statusUpdate.next({ id, attendance, absentReason })),
      filter(({ attendance }) => attendance === 'Y'),
      scan((acc, { id }) => acc.includes(studentsNameById[id])
        ? acc : [...acc, studentsNameById[id]].slice(-10), []),
      shareReplay(1) // keep track while switching mode
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

  /** Mark student attendance. */
  mark(student: string, attendance: string, absentEvent?: KeyboardEvent) {
    const el = absentEvent && absentEvent.target as HTMLInputElement;
    if (el) {
      el.blur();
    }
    const absentReason = el && el.value || null;

    // fallback to absent if reason is left empty
    if (attendance === 'R' && absentReason === null) {
      attendance = 'N';
    }

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
    this.markAttendance.mutate({ schedule, student, attendance, absentReason }, options).subscribe(
      () => {},
      e => { this.toast(`Mark ${stateMap[attendance]} failed: ` + e, 'danger'); console.error(e); }
    );
  }

  /** Mark all student as ... */
  markAll() {
    const markAll = (attendance: Attendance) => this.students$.pipe(first()).subscribe(students => {
      const options = {
        optimisticResponse: {
          __typename: 'Mutation' as 'Mutation',
          markAttendanceAll: students.map(({ id }) => ({
            __typename: 'Status' as 'Status',
            id,
          }))
        }
      };
      const schedule = this.schedule;
      const absentReason = null;
      this.markAttendanceAll.mutate({ schedule, attendance }, options).pipe(
        pluck('data', 'markAttendanceAll'),
        tap(statuses => statuses.forEach(({ id }) =>
          this.statusUpdate.next({ id, attendance, absentReason })
        )),
      ).subscribe(
        () => this.toast(`Marked all ${stateMap[attendance]}`, 'success'),
        e => { this.toast(`Mark all ${stateMap[attendance]} failed: ${e}`, 'danger'); console.error(e); },
      );
    });
    this.alertCtrl.create({
      header: 'Mark all students as ...',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Present',
          handler: () => markAll('Y')
        },
        {
          text: 'Late',
          handler: () => markAll('L')
        },
        {
          text: 'Absent',
          handler: () => markAll('N')
        }
      ]
    }).then(alert => alert.present());
  }

  /** Save lecture update notes. */
  save(lectureUpdate: string) {
    if (this.lectureUpdate !== lectureUpdate) {
      const schedule = this.schedule;
      this.saveLectureLog.mutate({ schedule, log: { lectureUpdate } }).subscribe(
        () => this.toast('Lecture update saved', 'success'),
        e => { this.toast('Lecture update failed: ' + e, 'danger'); console.error(e); }
      );
      this.lectureUpdate = lectureUpdate;
    }
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
