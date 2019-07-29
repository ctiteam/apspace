import { Component } from '@angular/core';

import { MarkAttendanceGQL } from './mark-attendance.mutation';
import { Observable } from 'apollo-link';

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.page.html',
  styleUrls: ['./mark-attendance.page.scss'],
})
export class MarkAttendancePage {

  numbers = new Array(6);

  otp = '';
  student = 100001;

  scan = false;  // scan code or type code
  qrScan$: Observable<number>;

  constructor(private markAttendance: MarkAttendanceGQL) { }

  scanCode() {
    this.markAttendance.mutate({ schedule: 'a', otp: this.otp, student: `TP${this.student++}` })
      .subscribe(d => console.log(d));
  }

  recordKey(ev) {
    console.log('record', ev);
  }

}
