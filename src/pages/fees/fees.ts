import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize } from 'rxjs/operators';

import {
  FeesBankDraft, FeesDetails, FeesSummary, FeesTotalSummary,
} from '../../interfaces';
import { WsApiProvider } from '../../providers';

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

  numOfSkeletons = new Array(5);
  isLoading: boolean;

  constructor(
    private ws: WsApiProvider,
  ) { }

  ionViewDidLoad() {
    this.isLoading = true;
    this.totalSummary$ = this.ws.get('/student/summary_overall_fee', true);
    this.summary$ = this.ws.get('/student/outstanding_fee', true);
    this.bankDraft$ = this.ws.get('/student/bankdraft_amount', true);
    this.details$ = this.ws.get('/student/overall_fee', true);
    forkJoin([this.totalSummary$, this.summary$]).pipe(
      finalize(() => this.isLoading = false),
    ).subscribe();
  }
}
