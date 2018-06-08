import { Component } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';

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

  attendance$: Observable<Attendance[]>;
  courses$: Observable<Course[]>;

  selectedIntake: string;
  studentId: string;
  loading: any;
  percent: number;
  averageColor: string;

  constructor(
    private ws: WsApiProvider,
    public loadingCtrl: LoadingController) { }

  getAttendance(intake: string, refresh: boolean = false): Observable<Attendance[]> {
    const opt = { params: { id: this.studentId, format: 'json' } };
    return this.attendance$ = this.ws.get<Attendance[]>(`/student/attendance?intake=${intake}`, refresh, opt)
      .pipe(
        tap(a => this.calculateAverage(a)),
        finalize(() => this.loading.dismiss())
      );
  }

  ionViewDidLoad() {
    this.presentLoading();
    this.courses$ = this.ws.get<Course[]>('/student/courses').pipe(
      tap(c => this.selectedIntake = c[0].INTAKE_CODE),
      tap(c => this.studentId = c[0].STUDENT_NUMBER),
      tap(c => this.getAttendance(this.selectedIntake)),
    );
  }

  doRefresh(refresher) {
    this.presentLoading();
    this.attendance$ = this.getAttendance(this.selectedIntake, true).pipe(
      finalize(() => refresher && refresher.complete() && this.loading.dismiss())
    );
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
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
      if (this.percent <= 80) {
        this.averageColor = "#f04141";
      }
    }
  }
}
