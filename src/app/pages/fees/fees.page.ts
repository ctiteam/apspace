import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import {
  FeesBankDraft, 
  FeesDetails, 
  FeesSummary, 
  FeesTotalSummary,
} from '../../interfaces';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.page.html',
  styleUrls: ['./fees.page.scss'],
})
export class FeesPage implements OnInit {
  selectedSegment = 'Summary';

  totalSummary$: Observable<FeesTotalSummary[]>;
  bankDraft$: Observable<FeesBankDraft[]>;
  detail$: Observable<FeesDetails[]>;
  summary$: Observable<FeesSummary[]>;

  constructor(private ws: WsApiService) { }

  ngOnInit() {
    this.totalSummary$ = this.ws.get('/student/summary_overall_fee', true);
    this.summary$ = this.ws.get('/student/outstanding_fee', true);
    this.bankDraft$ = this.ws.get('/student/bankdraft_amount', true);
    this.detail$ = this.ws.get('/student/overall_fee', true);
  }

  isNumber(val: any): boolean {
    return typeof val === 'number';
  }
}
