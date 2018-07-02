import { Component } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { IonicPage, NavController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize, map, tap } from 'rxjs/operators';

import { WsApiProvider, LoadingControllerProvider } from '../../providers';
import { Apcard } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-apcard',
  templateUrl: 'apcard.html',
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-30%)' }),
        animate(700)
      ]),
      transition('* => void', [
        animate(700, style({ transform: 'translateX(30%)' }))
      ])
    ])
  ]
})
export class ApcardPage {
  transaction$: Observable<Apcard[]>;
  filterEntry: string = '';
  balance: number;
  monthly: number;

  type = 'line';
  data: any;
  options = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(
    private ws: WsApiProvider,
    private navCtrl: NavController,
    private loading: LoadingControllerProvider,
  ) { }

  /** Analyze transactions. */
  analyzeTransactions(transactions: Apcard[]) {
    this.balance = transactions[0].Balance;

    const now = new Date();
    const monthlyData = transactions.reduce((tt, t) => {
      const c = t.SpendVal > 0 ? 'cr' : 'dr'; // classify spent type
      const d = new Date(t.SpendDate);

      d.getFullYear() in tt[c] || (tt[c][d.getFullYear()] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      tt[c][d.getFullYear()][d.getMonth()] += Math.abs(t.SpendVal);

      return tt;
    }, {  // default array with current year
      cr: { [now.getFullYear()]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      dr: { [now.getFullYear()]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
    });

    // plot graph
    this.data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Monthly Debit',
          data: monthlyData.dr[now.getFullYear()],
          backgroundColor: 'rgba(0, 200, 83, .5)'
        },
        {
          label: 'Monthly Credit',
          data: monthlyData.cr[now.getFullYear()],
          backgroundColor: 'rgba(213, 0, 0, .5)'
        }
      ]
    };

    // reverse monthlyData last year
    this.monthly = monthlyData.cr[now.getFullYear()][now.getMonth()];
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
    this.loading.presentLoading();
    const options = { url: 'https://api.apiit.edu.my' };
    this.transaction$ = this.ws.get<Apcard[]>('/apcard/', true, options).pipe(
      map(t => this.signTransactions(t)),
      tap(t => this.analyzeTransactions(t)),
      finalize(() => refresher && refresher.complete()),
      finalize(() => this.loading.dismissLoading())
    );
  }

  ionViewDidLoad() {
    this.doRefresh();
  }

  swipe(event) {
    if (event.direction === 2) {
      this.navCtrl.parent.select(4);
    }
    if (event.direction === 4) {
      this.navCtrl.parent.select(2);
    }
  }
}
