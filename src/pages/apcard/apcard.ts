import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize, map, tap } from 'rxjs/operators';

import { WsApiProvider } from '../../providers';
import { Apcard } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-apcard',
  templateUrl: 'apcard.html'
})
export class ApcardPage {
  transaction$: Observable<Apcard[]>;
  filterEntry: string = '';
  balance: number;
  monthly: number;

  constructor(private ws: WsApiProvider) { }

  /** Analyze transactions. */
  analyzeTransactions(transactions: Apcard[]) {
    this.balance = transactions[0].Balance;

    const now = new Date();
    this.monthly = transactions.filter(t => {
      const d = new Date(t.SpendDate);
      return d.getFullYear() === now.getFullYear() && t.SpendVal > 0;
    }).map(t => t.SpendVal).reduce((a, b) => a + b, 0);
  }

  /** Negate spend value for top ups. */
  signTransactions(transactions: Apcard[]): Apcard[] {
    transactions.forEach(transaction => {
      if (transaction.ItemName === 'Top Up') {
        transaction.SpendVal *= -1;
      }
    });
    return transactions;
  }

  doRefresh(refresher?) {
    const options = { url: 'https://api.apiit.edu.my' };
    this.transaction$ = this.ws.get<Apcard[]>('/apcard/', true, options).pipe(
      map(t => this.signTransactions(t)),
      tap(t => this.analyzeTransactions(t)),
      finalize(() => refresher && refresher.complete()),
    );
  }

  ionViewDidLoad() {
    this.doRefresh();
  }
}
