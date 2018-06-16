import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { tap, finalize } from 'rxjs/operators';

import { WsApiProvider, LoadingControllerProvider } from '../../providers';
import { Attendance, Course } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html',
})

export class AttendancePage {

  attendance$: Observable<Attendance[]>;
  courses$: Observable<Course[]>;

  selectedIntake: string;
  studentId: string;
  percent: number;
  averageColor: string;

  constructor(
    private ws: WsApiProvider,
    public loading: LoadingControllerProvider) { }

  getAttendance(intake: string, refresh: boolean = false): Observable<Attendance[]> {
    this.loading.presentLoading();
    const opt = { params: { id: this.studentId, format: 'json' } };
    return this.attendance$ = this.ws.get<Attendance[]>(`/student/attendance?intake=${intake}`, refresh, opt)
      .pipe(
        tap(a => this.calculateAverage(a)),
        finalize(() => this.loading.dismissLoading())
      );
  }

  ionViewDidLoad() {
    this.courses$ = this.ws.get<Course[]>('/student/courses').pipe(
      tap(c => this.selectedIntake = c[0].INTAKE_CODE),
      tap(c => this.studentId = c[0].STUDENT_NUMBER),
      tap(c => this.getAttendance(this.selectedIntake)),
    );
  }

  doRefresh(refresher) {
    this.attendance$ = this.getAttendance(this.selectedIntake, true).pipe(
      finalize(() => refresher && refresher.complete())
    );
  }

  calculateAverage(a: any) {
    let sumOfAttendances = 0;

    if (!a) {
      this.percent = 0;
      this.averageColor = "#f04141";
    }
    else {
      for (let attendance of a) {
        sumOfAttendances += attendance.PERCENTAGE;
      }
      let averageAttendance = (sumOfAttendances / a.length).toFixed(2)
      this.percent = parseInt(averageAttendance);
      this.averageColor = "#0dbd53";
      if (this.percent < 80) {
        this.averageColor = "#f04141";
      }
    }
  }
}
