import { Component } from '@angular/core';

import { MarkAttendanceMutation } from './mark-attendance-mutation';
import { Observable } from 'apollo-link';

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.page.html',
  styleUrls: ['./mark-attendance.page.scss'],
})
export class MarkAttendancePage {

  qrScan$: Observable<number>;

  constructor(private markAttendance: MarkAttendanceMutation) { }

  scanCode() {
    this.markAttendance.mutate(
      { schedule: 'a', otp: '123456', student: 'TP100340'})
      .subscribe(d => console.log(d));
  }

}
