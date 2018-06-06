import { Component, NgModule } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';
import { NgCircleProgressModule } from 'ng-circle-progress';

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
  percent: any;

  constructor(
    private ws: WsApiProvider,
    public loadingCtrl: LoadingController) { }

  getAttendance(intake: string, refresh: boolean = false): Observable<Attendance[]> {
    this.presentLoading();
    const opt = { params: { id: this.studentId, format: 'json' } };
    return this.attendance$ = this.ws.get<Attendance[]>(`/student/attendance?intake=${intake}`, refresh, opt).pipe(
      tap(a => this.loading.dismiss()),
      tap(a => this.calculateAverage(a))
    );
  }

  ionViewDidLoad() {
    this.courses$ = this.ws.get<Course[]>('/student/courses').pipe(
      tap(c => this.selectedIntake = c[0].INTAKE_CODE),
      tap(c => this.studentId = c[0].STUDENT_NUMBER),
      tap(c => this.getAttendance(this.selectedIntake))
    );
  }

  doRefresh(refresher) {
    this.attendance$ = this.getAttendance(this.selectedIntake, true).pipe(
      finalize(() => refresher && refresher.complete())
    );
  }

  presentLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  calculateAverage(a: any){
    let sumOfAttendances = 0;
    let sumOfClasses = 0;

    for(let attendance of a){
      sumOfAttendances += attendance.PERCENTAGE;
      sumOfClasses += attendance.TOTAL_CLASSES;
    }
    let averageAttendance = (sumOfAttendances/a.length).toFixed(2)
    console.log(averageAttendance);
    this.percent = averageAttendance;
  }

}
