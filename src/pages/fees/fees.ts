import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import { WsApiProvider } from '../../providers';
import {
  FeesTotalSummary, FeesBankDraft, FeesDetails, FeesSummary
} from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-fees',
  templateUrl: 'fees.html'
})
export class FeesPage {
  selectedSegment: string = 'Summary';

  totalSummary$: Observable<FeesTotalSummary[]>;
  bankDraft$: Observable<FeesBankDraft[]>;
  details$: Observable<FeesDetails[]>;
  summary$: Observable<FeesSummary[]>;

  constructor(private ws: WsApiProvider) { }

  ionViewDidLoad() {
    this.totalSummary$ = this.ws.get('/student/summary_outstanding_fee', true);
    this.summary$ = this.ws.get('/student/outstanding_fee', true);
    this.bankDraft$ = this.ws.get('/student/bankdraft_amount', true);
    this.details$ = this.ws.get('/student/overall_fee', true);
  }
}
