import { Component } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize } from 'rxjs/operators';

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

  constructor(
    private ws: WsApiProvider,
    public loadingCtrl: LoadingController) { }

  ionViewDidLoad() {
    const loading = this.presentLoading();
    this.totalSummary$ = this.ws.get('/student/summary_overall_fee', true);
    this.summary$ = this.ws.get('/student/outstanding_fee', true);
    this.bankDraft$ = this.ws.get('/student/bankdraft_amount', true);
    this.details$ = this.ws.get('/student/overall_fee', true);
    forkJoin([this.totalSummary$, this.summary$]).pipe(
      finalize(() => loading.dismiss())
    ).subscribe();
  }

  presentLoading() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    return loading;
  }
}
