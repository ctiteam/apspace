import { Component } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { tap, finalize } from 'rxjs/operators';

import { WsApiProvider } from '../../providers';
import { Course, Subcourse, Attendance } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
  providers: []
})

export class ResultsPage {

  intakes$: Observable<Course[]>;
  results$: Observable<Subcourse>;

  selectedIntake: string;
  studentId: string;
  loading: any;

  constructor(
    private ws: WsApiProvider,
    public loadingCtrl: LoadingController) { }

  getResults(intake: string, refresh: boolean = false): Observable<Subcourse> {
    this.presentLoading();
    const opt = { params: { id: this.studentId, format: 'json' } };
    return this.results$ = this.ws.get<Subcourse>(`/student/subcourses?intake=${intake}`, refresh, opt).pipe(
      tap(r => this.loading.dismiss())
    )
  }

  ionViewDidLoad() {
    this.intakes$ = this.ws.get<Course[]>('/student/courses').pipe(
      tap(i => this.selectedIntake = i[0].INTAKE_CODE),
      tap(i => this.studentId = i[0].STUDENT_NUMBER),
      tap(i => this.getResults(this.selectedIntake))
    );
  }

  doRefresh(refresher?) {
    this.results$ = this.getResults(this.selectedIntake, true).pipe(
      finalize(() => refresher.complete())
    )
  }

  presentLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }
}
