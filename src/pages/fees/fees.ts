import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize } from 'rxjs/operators';

import {
  FeesBankDraft, FeesDetails, FeesSummary, FeesTotalSummary,
} from '../../interfaces';
import { LoadingControllerProvider, WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-fees',
  templateUrl: 'fees.html',
})
export class FeesPage {
  selectedSegment: string = 'Summary';

  totalSummary$: Observable<FeesTotalSummary[]>;
  bankDraft$: Observable<FeesBankDraft[]>;
  details$: Observable<FeesDetails[]>;
  summary$: Observable<FeesSummary[]>;

  constructor(
    private ws: WsApiProvider,
    public loading: LoadingControllerProvider) { }

  ionViewDidLoad() {
    this.loading.presentLoading();
    this.totalSummary$ = this.ws.get('/student/summary_overall_fee', true);
    this.summary$ = this.ws.get('/student/outstanding_fee', true);
    this.bankDraft$ = this.ws.get('/student/bankdraft_amount', true);
    this.details$ = this.ws.get('/student/overall_fee', true);
    forkJoin([this.totalSummary$, this.summary$]).pipe(
      finalize(() => this.loading.dismissLoading()),
    ).subscribe();
  }
}
