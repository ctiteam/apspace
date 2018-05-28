import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { tap, finalize } from 'rxjs/operators';

import { WsApiProvider } from '../../providers';
import { Course, FeesSummary, FeesBankDraft, FeesDetails } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-fees',
  templateUrl: 'fees.html'
})
export class FeesPage {

  fee: string = "summary";
  studentId: string;

  courses$: Observable<Course[]>;
  summary$: Observable<FeesSummary[]>;
  bankDraft$: Observable<FeesBankDraft[]>;
  details$: Observable<FeesDetails[]>;

  constructor(
    public navCtrl: NavController,
    private ws: WsApiProvider) {

  }

  getFeesSummary(studentId: string, refresh: boolean = false): Observable<FeesSummary[]>{
    const opt = { params: { id: this.studentId, format: 'json' } };
    return this.summary$ = this.ws.get(`/student/check_outstanding_fee?id=${studentId}`, refresh, opt);
  }

  getFeesBankDraft(studentId: string, refresh: boolean = false): Observable<FeesBankDraft[]>{
    const opt = { params: { id: this.studentId, format: 'json' } };
    return this.bankDraft$ = this.ws.get(`/student/check_bankdraft_amount?id=${studentId}`, refresh, opt);
  }

  getFeesDetails(studentId: string, refresh: boolean = false): Observable<FeesDetails[]>{
    const opt = { params: { id: this.studentId, format: 'json' } };
    return this.details$ = this.ws.get(`/student/check_overall_fee?id=${studentId}`, refresh, opt);
  }

  ionViewDidLoad(){
    this.courses$ = this.ws.get<Course[]>('/student/courses').pipe(
      tap(c => this.studentId = c[0].STUDENT_NUMBER),
      tap(c => {
        this.getFeesSummary(this.studentId),
        this.getFeesBankDraft(this.studentId),
        this.getFeesDetails(this.studentId)})
    );
    this.courses$.subscribe();
  }


}
