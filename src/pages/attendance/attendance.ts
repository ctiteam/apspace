import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { tap, finalize } from 'rxjs/operators';

import { WsApiProvider } from '../../providers';
import { Attendance, Course } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html',
})
export class AttendancePage {

  attendance$: Observable<Attendance>;
  courses$: Observable<Course[]>;

  selectedIntake: string;
  studentId: string;

  constructor(private ws: WsApiProvider) { }

  getAttendance(intake: string, refresh: boolean = false): Observable<Attendance> {
    console.debug('getAttendance', this.studentId, intake, refresh);
    const opt = { params: { id: this.studentId, format: 'json' } };
    return this.attendance$ = this.ws.get(`/student/attendance?intake=${intake}`, refresh, opt);
  }

  ionViewDidLoad() {
    this.courses$ = this.ws.get<Course[]>('/student/courses').pipe(
      tap(c => this.selectedIntake = c[0].INTAKE_CODE),
      tap(c => this.studentId = c[0].STUDENT_NUMBER),
      tap(c => this.getAttendance(c[0].INTAKE_CODE))
    );
  }

  doRefresh(refresher?) {
    console.debug(this.selectedIntake);
    this.attendance$ = this.getAttendance(this.selectedIntake, true).pipe(
      finalize(() => refresher.complete())
    );
  }

}
