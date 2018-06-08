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
  color: string;
  averageColor: string;

  constructor(
    private ws: WsApiProvider,
    public loadingCtrl: LoadingController) { }

  getAttendance(intake: string, refresh: boolean = false): Observable<Attendance[]> {
    const opt = { params: { id: this.studentId, format: 'json' } };
    return this.attendance$ = this.ws.get<Attendance[]>(`/student/attendance?intake=${intake}`, refresh, opt).pipe(
      tap(a => this.calculateAverage(a))
    );
  }

  ionViewDidLoad() {
    const loading = this.presentLoading();
    this.courses$ = this.ws.get<Course[]>('/student/courses').pipe(
      tap(c => this.selectedIntake = c[0].INTAKE_CODE),
      tap(c => this.studentId = c[0].STUDENT_NUMBER),
      tap(c => this.getAttendance(this.selectedIntake)),
      finalize(() => loading.dismiss())
    );
  }

  doRefresh(refresher) {
    this.attendance$ = this.getAttendance(this.selectedIntake, true).pipe(
      finalize(() => refresher && refresher.complete())
    );
  }

  presentLoading() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    return loading;
  }

  calculateAverage(a: any) {
    let sumOfAttendances = 0;

    if (!a) {
      this.percent = 0;
    }
    else {
      for (let attendance of a) {
        sumOfAttendances += attendance.PERCENTAGE;
      }
      let averageAttendance = (sumOfAttendances / a.length).toFixed(2)
      this.percent = parseInt(averageAttendance);
      this.averageColor = "#0dbd53";
      if (this.percent >= 70 && this.percent <= 80) {
        this.averageColor = "#fd5000";
      } else if (this.percent >= 0 && this.percent <= 69) {
        this.averageColor = "#f04141";
      }

    }
  }
}
