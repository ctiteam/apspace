import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, Subject, timer, NEVER } from 'rxjs';
import {
  catchError, finalize, first, map, pluck, scan, shareReplay, startWith,
  switchMap, tap,
} from 'rxjs/operators';
import { authenticator } from 'otplib/otplib-browser';

import {
  AttendanceGQL, InitAttendanceGQL, NewStatusSubscription,
  InitAttendanceMutation, MarkAttendanceGQL, NewStatusGQL, ScheduleInput,
  Status
} from '../../../../generated/graphql';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.page.html',
  styleUrls: ['./mark-attendance.page.scss'],
})
export class MarkAttendancePage implements OnInit {

  schedule: ScheduleInput;

  auto = true;
  term = '';
  type: 'Y' | 'L' | 'N' | 'R' | '' = 'N';

  otp$: Observable<number>;
  lastMarked$: Observable<Pick<NewStatusSubscription, 'newStatus'>[]>;
  students$: Observable<Partial<Status>[]>;
  totalPresentStudents$: Observable<number>;
  totalStudents$: Observable<number>;

  statusUpdate = new Subject<{ id: string; attendance: string }>();

  constructor(
    private attendance: AttendanceGQL,
    private initAttendance: InitAttendanceGQL,
    private markAttendance: MarkAttendanceGQL,
    private newStatus: NewStatusGQL,
    private route: ActivatedRoute,
    public toastCtrl: ToastController
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

    // get attendance state from query and use manual mode if attendance initialized
    const attendancesState$ = this.initAttendance.mutate({ schedule }).pipe(
      catchError(() => (this.auto = false, this.type = '', this.attendance.fetch({ schedule }))),
      catchError(err => (this.toast(err.message.replace('GraphQL error: ', '')), console.error(err), NEVER)),
      pluck('data'),
      finalize(() => 'initAttendance ended'),
      tap((query: InitAttendanceMutation) => {
        studentsNameById = query.attendance.students.reduce((acc, s) => (acc[s.id] = s, acc), {});
      })
    );

    // keep updating attendancesState$ with new changes
    const attendances$ = attendancesState$.pipe(
      switchMap(state => this.statusUpdate.asObservable().pipe(startWith(state))),
      scan((state: InitAttendanceMutation, action: { id: string; attendance: string; }) => {
        const student = state.attendance.students.find(s => s.id === action.id);
        student.attendance = action.attendance;
        return state;
      }),
      shareReplay(1) // keep track while switching mode
    );

    const secret$ = attendances$.pipe(
      pluck('attendance', 'secret'),
      shareReplay(1) // used shareReplay for observable subscriptions time gap
    );

    // only regenerate otp when needed
    this.otp$ = secret$.pipe(
      switchMap(secret =>
        timer(authenticator.timeRemaining() * 1000, authenticator.options.step * 1000).pipe(
          startWith(() => authenticator.generate(secret)),
          map(() => authenticator.generate(secret))
        )
      )
    );

    // take last 5 values updated and ignore duplicates
    console.log('schedule', schedule);
    this.lastMarked$ = this.newStatus.subscribe(schedule).pipe(
      pluck('data', 'newStatus'),
      tap(({ id }) => console.log('new', id, studentsNameById[id])),
      tap(({ id, attendance }) => this.statusUpdate.next({ id, attendance })),
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

  /** Mark student attendance. */
  mark(student: string, attendance: string) {
    // TODO: optimistic ui does not work yet
    const options = {
      optimisticResponse: {
        __typename: 'Mutation' as 'Mutation',
        markAttendance: {
          __typename: 'Status' as 'Status',
          id: student,
          attendance,
          ...this.schedule
        }
      }
    };
    this.markAttendance.mutate({ schedule: this.schedule, student, attendance }, options).subscribe(
      () => {},
      e => console.error(e) // XXX: retry attendance$ on failure
    );
  }

  /** Helper function to toast error message. */
  toast(message: string) {
    this.toastCtrl.create({
      message: 'Failed to mark attendance: ' + message,
      duration: 2000,
      position: 'top',
      color: 'danger'
    }).then(toast => toast.present());
  }

  trackById(index: number, item: Pick<Status, 'id'>) {
    return item.id;
  }

}
