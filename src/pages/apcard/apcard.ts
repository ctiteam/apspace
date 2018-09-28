import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize, map, tap } from 'rxjs/operators';

import { Apcard, Role } from '../../interfaces';
import { SettingsProvider, WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-apcard',
  templateUrl: 'apcard.html',
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-30%)' }),
        animate(700),
      ]),
      transition('* => void', [
        animate(700, style({ transform: 'translateX(30%)' })),
      ]),
    ]),
  ],
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
    maintainAspectRatio: false,
  };

  numOfSkeletons = new Array(5);
  isLoading: boolean;

  constructor(
    private ws: WsApiProvider,
    private navCtrl: NavController,
    private settings: SettingsProvider,
  ) { }

  /** Analyze transactions. */
  analyzeTransactions(transactions: Apcard[]) {
    // stop analyzing if transactions is empty
    if (transactions.length === 0) {
      return;
    }
    this.balance = transactions[0].Balance;

    const now = new Date();
    const a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const monthlyData = transactions.reduce((tt, t) => {
      const c = t.SpendVal > 0 ? 'dr' : 'cr'; // classify spent type
      const d = new Date(t.SpendDate);

      d.getFullYear() in tt[c] || (tt[c][d.getFullYear()] = a.slice());
      tt[c][d.getFullYear()][d.getMonth()] += Math.abs(t.SpendVal);

      return tt;
      // default array with current year
    }, { dr: { [now.getFullYear()]: a.slice() }, cr: { [now.getFullYear()]: a.slice() } });

    // plot graph
    this.data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Monthly Credit',
          data: monthlyData.cr[now.getFullYear()],
          borderColor: 'rgba(0, 200, 83, .5)',
          backgroundColor: 'rgba(0, 200, 83, .5)',
          fill: false,
        },
        {
          label: 'Monthly Debit',
          data: monthlyData.dr[now.getFullYear()],
          borderColor: 'rgba(230, 0, 0, .5)',
          backgroundColor: 'rgba(230, 0, 0, .5)',
          fill: false,
        },
      ],
    };

    // reverse monthlyData last year
    this.monthly = monthlyData.dr[now.getFullYear()][now.getMonth()];
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
    this.isLoading = true;
    this.transaction$ = this.ws.get<Apcard[]>('/apcard/', true).pipe(
      map(t => this.signTransactions(t)),
      tap(t => this.analyzeTransactions(t)),
      finalize(() => refresher && refresher.complete()),
      finalize(() => this.isLoading = false),
    );
  }

  ionViewDidLoad() {
    this.doRefresh();
  }

  swipe(event) {
    const role = this.settings.get('role');
    if (role & Role.Student) {
      if (event.direction === 2) {
        this.navCtrl.parent.select(4);
      }
      if (event.direction === 4) {
        this.navCtrl.parent.select(2);
      }
    } else if (role & (Role.Lecturer | Role.Admin)) {
      if (event.direction === 2) {
        this.navCtrl.parent.select(2);
      }
      if (event.direction === 4) {
        this.navCtrl.parent.select(0);
      }
    }
  }
}
