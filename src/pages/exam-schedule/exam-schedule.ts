import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { tap, finalize } from 'rxjs/operators';

import { ExamScheduleProvider, WsApiProvider, LoadingControllerProvider } from '../../providers';
import { ExamSchedule, StudentProfile } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-exam-schedule',
  templateUrl: 'exam-schedule.html',
})
export class ExamSchedulePage {

  examSchedule$: Observable<ExamSchedule[]>;
  profile$: Observable<StudentProfile[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private exam: ExamScheduleProvider,
    private ws: WsApiProvider,
    private loading: LoadingControllerProvider,
  ) { }

  ionViewDidLoad() {
    this.loading.presentLoading();
    this.profile$ = this.ws.get<StudentProfile[]>('/student/profile').pipe(
      tap(p => this.getExamSchedule(p[0].STUDENT_NUMBER, p[0].INTAKE_CODE)),
      finalize(() => this.loading.dismissLoading())
    )
  }

  getExamSchedule(tpnumber: string, intake: string): Observable<ExamSchedule[]> {
    return this.examSchedule$ = this.exam.get(tpnumber, intake);
  }
}
