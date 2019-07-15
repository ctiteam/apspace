import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, pluck, startWith, switchMap } from 'rxjs/operators';
import { totp } from 'otplib/otplib-browser';

import { InitAttendanceMutation } from './init-attendance.mutation';

@Component({
  selector: 'app-take-attendance',
  templateUrl: './take-attendance.page.html',
  styleUrls: ['./take-attendance.page.scss'],
})
export class TakeAttendancePage implements OnInit {

  otp$: Observable<number>;

  constructor(private initAttendance: InitAttendanceMutation) { }

  ngOnInit() {
    this.otp$ = this.initAttendance.mutate({ schedule: 'a' }).pipe(
      pluck('data', 'initAttendance', 'secret'),
      switchMap(secret =>
        timer(totp.timeRemaining() * 1000, totp._options.step * 1000).pipe(
          startWith(() => totp.generate(secret)),
          map(() => totp.generate(secret))
        )
      )
    );
  }

}
