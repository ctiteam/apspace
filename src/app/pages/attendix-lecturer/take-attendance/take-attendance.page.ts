import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, Subject, merge, timer, NEVER } from 'rxjs';
import {
  catchError, first, map, pluck, scan, shareReplay, startWith, switchMap, tap
} from 'rxjs/operators';
import { totp } from 'otplib/otplib-browser';

import { AttendanceGQL } from './attendance.query';
import { InitAttendanceGQL } from './init-attendance.mutation';
import { MarkAttendanceGQL } from './mark-attendance.mutation';
import { NewStatusGQL } from './new-status.subscription';
import { Status } from './status.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-take-attendance',
  templateUrl: './take-attendance.page.html',
  styleUrls: ['./take-attendance.page.scss'],
})
export class TakeAttendancePage implements OnInit {

  schedule = 'a';

  auto = true;
  term = '';

  otp$: Observable<number>;
  lastMarked$: Observable<string[]>;
  students$: Observable<Status[]>;
  totalPresentStudents$: Observable<number>;
  totalStudents$: Observable<number>;

  statusUpdate = new Subject<{ name: string; attendance: string }>();

  constructor(
    private initAttendance: InitAttendanceGQL,
    private attendance: AttendanceGQL,
    private newStatus: NewStatusGQL,
    private markAttendance: MarkAttendanceGQL,
    public toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    const schedule = this.schedule;

    // get attendance state from query
    const attendancesState$ = this.initAttendance.mutate({ schedule }).pipe(
      catchError(err => this.attendance.fetch({ schedule })),
      catchError(err => (this.toastCtrl.create({
        message: 'Failed to take attendance.',
        duration: 2000,
        position: 'top',
        color: 'danger'
      }), NEVER))
    );

    // keep updating attendancesState$ with new changes
    const attendances$ = merge(attendancesState$, this.statusUpdate.asObservable()).pipe(
      scan((state, action) => {
        const student = state.data.attendance.students.find(s => s.id === action.id);
        student.attendance = action.attendance;
        return state;
      }),
      // XXX: repeat when dynamodb record is deleted (expiredTime not accurate)
      // takeUntil(this.updateError)
      // repeat(),
      shareReplay(1) // keep track while switching mode
    );

    const secret$ = attendances$.pipe(
      pluck('data', 'attendance', 'secret'),
      shareReplay(1) // used shareReplay for observable subscriptions time gap
    );

    // only regenerate otp when needed
    this.otp$ = secret$.pipe(
      switchMap(secret =>
        timer(totp.timeRemaining() * 1000, totp._options.step * 1000).pipe(
          startWith(() => totp.generate(secret)),
          map(() => totp.generate(secret))
        )
      )
    );

    // take last 5 values updated by students (ignore manual override updates)
    // XXX: cool that it ignore manual overrides updates but I do not know how
    this.lastMarked$ = secret$.pipe(
      switchMap(secret => this.newStatus.subscribe({ schedule })),
      pluck('data', 'newStatus', 'name'),
      tap(name => this.statusUpdate.next({ name, attendance: 'P' })),
      scan((acc, name) => [...acc, name].slice(-5), []),
      shareReplay(1) // keep track when enter manual mode
    );

    this.students$ = attendances$.pipe(
      pluck('data', 'attendance', 'students'),
      shareReplay(1)
    );

    this.totalPresentStudents$ = this.students$.pipe(
      map(students => students.filter(student => student.attendance === 'P').length)
    );

    this.totalStudents$ = this.students$.pipe(
      map(students => students.length),
      first() // total does not change so stop counting
    );
  }

  mark(student: string, attendance: 'A' | 'L' | 'P') {
    // TODO: optimistic ui
    this.markAttendance.mutate({ schedule: this.schedule, student, attendance }).subscribe(
      d => this.statusUpdate.next({ name: student, attendance }),
      e => console.error(e) // XXX: retry attendance$ on failure
    );
  }

  trackById(index: number, item: Status) {
    return item.id;
  }

}
