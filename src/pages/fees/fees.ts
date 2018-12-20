import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

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
  selectedSegment = 'Summary';

  totalSummary$: Observable<FeesTotalSummary[]>;
  bankDraft$: Observable<FeesBankDraft[]>;
  detail$: Observable<FeesDetails[]>;
  summary$: Observable<FeesSummary[]>;

  constructor(private ws: WsApiProvider) { }

  ionViewDidLoad() {
    this.totalSummary$ = this.ws.get('/student/summary_overall_fee', true);
    this.summary$ = this.ws.get('/student/outstanding_fee', true);
    this.bankDraft$ = this.ws.get('/student/bankdraft_amount', true);
    this.detail$ = this.ws.get('/student/overall_fee', true);
  }

  isNumber(val: any): boolean {
    return typeof val === 'number';
  }

}
