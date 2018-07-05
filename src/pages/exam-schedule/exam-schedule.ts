import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { finalize, switchMap } from 'rxjs/operators';

import { WsApiProvider, LoadingControllerProvider } from '../../providers';
import { ExamSchedule, StudentProfile } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-exam-schedule',
  templateUrl: 'exam-schedule.html',
})
export class ExamSchedulePage {

  exam$: Observable<ExamSchedule[]>;

  constructor(
    private ws: WsApiProvider,
    private loading: LoadingControllerProvider,
  ) { }

  ionViewDidLoad() {
    this.loading.presentLoading();
    this.exam$ = this.ws.get<StudentProfile[]>('/student/profile').pipe(
      switchMap(p => {
        if (p.length !== 1) {
          console.error(p);
          throw new Error('Invalid profile');
        };
        const url = `/examination/${p[0].INTAKE_CODE}`;
        const options = { url: 'https://api.apiit.edu.my', auth: false };
        return this.ws.get<ExamSchedule[]>(url, true, options);
      }),
      finalize(() => this.loading.dismissLoading()),
    );
  }
}
