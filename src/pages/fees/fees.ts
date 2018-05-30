import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { tap, finalize } from 'rxjs/operators';

import { WsApiProvider } from '../../providers';
import { Course, FeesTotalSummary, FeesBankDraft,
  FeesDetails, FeesSummary } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-fees',
  templateUrl: 'fees.html'
})
export class FeesPage {

  fee: string = "Summary";
  studentId: string;

  courses$: Observable<Course[]>;
  totalSummary$: Observable<FeesTotalSummary[]>;
  bankDraft$: Observable<FeesBankDraft[]>;
  details$: Observable<FeesDetails[]>;
  summary$: Observable<FeesSummary[]>;

  constructor(
    public navCtrl: NavController,
    private ws: WsApiProvider) {}

  getFeesTotalSummary(studentId: string, refresh: boolean = false): Observable<FeesTotalSummary[]>{
    return this.totalSummary$ = this.ws.get(`/student/check_summary_outstanding_fee?id=${studentId}`, refresh);
  }

  getFeesSummary(studentId: string, refresh: boolean = false): Observable<FeesSummary[]>{
    return this.summary$ = this.ws.get(`/student/check_outstanding_fee?id=${studentId}`, refresh);
  }

  getFeesBankDraft(studentId: string, refresh: boolean = false): Observable<FeesBankDraft[]>{
    return this.bankDraft$ = this.ws.get(`/student/check_bankdraft_amount?id=${studentId}`, refresh);
  }

  getFeesDetails(studentId: string, refresh: boolean = false): Observable<FeesDetails[]>{
    return this.details$ = this.ws.get(`/student/check_overall_fee?id=${studentId}`, refresh);
  }

  ionViewDidLoad(){
    this.courses$ = this.ws.get<Course[]>('/student/courses').pipe(
      tap(c => this.studentId = c[0].STUDENT_NUMBER),
      tap(c => this.getFeesTotalSummary(c[0].STUDENT_NUMBER)),
      tap(c => this.getFeesSummary(c[0].STUDENT_NUMBER)),
      tap(c => this.getFeesBankDraft(c[0].STUDENT_NUMBER)),
      tap(c => this.getFeesDetails(c[0].STUDENT_NUMBER)))
    this.courses$.subscribe();
  }

  doRefresh(refresher) {
    this.totalSummary$ = this.getFeesTotalSummary(this.studentId, true).pipe(
      finalize(() => refresher.complete())
    );
    this.summary$ = this.getFeesSummary(this.studentId, true).pipe(
      finalize(() => refresher.complete())
    );
    this.bankDraft$ = this.getFeesBankDraft(this.studentId, true).pipe(
      finalize(() => refresher.complete())
    );
    this.details$ = this.getFeesDetails(this.studentId, true).pipe(
      finalize(() => refresher.complete())
    );
  }
}
