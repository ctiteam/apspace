import { Component } from '@angular/core';

import { MarkAttendanceGQL } from './mark-attendance.mutation';
import { Observable } from 'apollo-link';

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.page.html',
  styleUrls: ['./mark-attendance.page.scss'],
})
export class MarkAttendancePage {

  otp = '';
  student = 100001;

  qrScan$: Observable<number>;

  constructor(private markAttendance: MarkAttendanceGQL) { }

  scanCode() {
    this.markAttendance.mutate({ schedule: 'a', otp: this.otp, student: `TP${this.student++}` })
      .subscribe(d => console.log(d));
  }

}
