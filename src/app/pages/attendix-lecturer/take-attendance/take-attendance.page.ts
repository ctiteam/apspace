import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, timer, NEVER } from 'rxjs';
import { catchError, map, pluck, scan, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { totp } from 'otplib/otplib-browser';

import { AttendanceGQL } from './attendance.query';
import { InitAttendanceGQL } from './init-attendance.mutation';
import { NewStatusGQL } from './new-status.subscription';

@Component({
  selector: 'app-take-attendance',
  templateUrl: './take-attendance.page.html',
  styleUrls: ['./take-attendance.page.scss'],
})
export class TakeAttendancePage implements OnInit {

  otp$: Observable<number>;
  lastMarked$: Observable<string[]>;

  constructor(
    private initAttendance: InitAttendanceGQL,
    private attendance: AttendanceGQL,
    private newStatus: NewStatusGQL,
    public toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    const schedule = 'a';

    const secret$ = this.initAttendance.mutate({ schedule }).pipe(
      catchError(err => this.attendance.fetch({ schedule })),
      catchError(err => (this.toastCtrl.create({
        message: 'Failed to take attendance.',
        duration: 2000,
        position: 'top',
        color: 'danger'
      }), NEVER)),
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

    // take last 5 values that are marked
    this.lastMarked$ = secret$.pipe(
      switchMap(secret => this.newStatus.subscribe({ schedule })),
      pluck('data', 'newStatus', 'id'),
      scan((acc, id) => [...acc, id].slice(-5), [])
    );
  }

}
