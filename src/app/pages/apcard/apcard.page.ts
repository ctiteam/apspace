import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { Apcard } from '../../interfaces';
import { WsApiService } from 'src/app/services';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

type VisibleOption = 'all' | 'credit' | 'debit';

@Component({
  selector: 'app-apcard',
  templateUrl: './apcard.page.html',
  styleUrls: ['./apcard.page.scss'],
})
export class ApcardPage implements OnInit {
  transaction$: Observable<Apcard[]>;
  filterEntry = '';
  balance: number;
  monthly: number;
  monthlyTransactions: any;
  monthlyData: { cr: {}, dr: {} } = { cr: {}, dr: {} };
  transactionsGroupedByDate: any;
  transactonsYears: string[] = [];
  transactionsMonths: string[] = [];
  months = [
    { name: 'January', value: '0' },
    { name: 'February', value: '1' },
    { name: 'March', value: '2' },
    { name: 'April', value: '3' },
    { name: 'May', value: '4' },
    { name: 'June', value: '5' },
    { name: 'July', value: '6' },
    { name: 'August', value: '7' },
    { name: 'September', value: '8' },
    { name: 'October', value: '9' },
    { name: 'November', value: '10' },
    { name: 'December', value: '11' },
  ];


  filterObject: {
    year: string,
    month: string,
    show: VisibleOption
  } = {
      year: '',
      month: '',
      show: 'all'
    };

  skeletonConfig = [
    { numOfTrans: new Array(4) },
    { numOfTrans: new Array(1) },
    { numOfTrans: new Array(7) },
    { numOfTrans: new Array(2) },
    { numOfTrans: new Array(6) }
  ];
  isLoading: boolean;


  constructor(
    private ws: WsApiService,
    private menu: MenuController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.doRefresh();
  }

  /** Analyze transactions. */
  analyzeTransactions(transactions: Apcard[]) {
    // stop analyzing if transactions is empty
    if (transactions.length === 0) {
      return;
    }
    this.balance = transactions[0].Balance;

    const now = new Date();
    const a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.monthlyData = transactions.reduce(
      (tt, transaction) => {
        const c = transaction.SpendVal < 0 ? 'dr' : 'cr'; // classify spent type
        const d = new Date(transaction.SpendDate);
        if (!(d.getFullYear() in tt[c])) {
          tt[c][d.getFullYear()] = a.slice();
        }
        tt[c][d.getFullYear()][d.getMonth()] += Math.abs(transaction.SpendVal);

        return tt;
        // default array with current year
      }, {
      dr: { [now.getFullYear()]: a.slice() },
      cr: { [now.getFullYear()]: a.slice() }
    }
    );

    this.transactionsGroupedByDate = transactions.reduce(
      (acc: { [s: string]: Apcard[] }, transaction: Apcard) => {
        const spendDate = new Date(transaction.SpendDate);
        const key = `${spendDate.getMonth()}, ${spendDate.getFullYear()}`;

        acc[key] = acc[key] || [];
        acc[key].push(transaction);

        return acc;
      },
      {}
    );

    // reverse monthlyData last year
    this.monthly = this.monthlyData.dr[now.getFullYear()][now.getMonth()];
  }

  /** Negate spend value for top ups. */
  signTransactions(transactions: Apcard[]): Apcard[] {
    transactions.forEach(transaction => {
      if (transaction.ItemName !== 'Top Up') {
        // always make it negative (mutates cached value)
        transaction.SpendVal = -Math.abs(transaction.SpendVal);
      }
    });
    return transactions;
  }

  getAbsoluteValue(num: number): number {
    return Math.abs(num);
  }

  getTransactionsYears() {
    this.transactonsYears = [];
    this.transactionsMonths = [];
    const firstTransactionYear = Object.keys(this.monthlyData.cr)[0];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= +firstTransactionYear; year--) {
      this.transactonsYears.push(year.toString());
    }
    for (let month = 11; month >= 0; month--) {
      this.transactionsMonths.push(month.toString());
    }
  }

  isEmpty(object: {}) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  doRefresh(refresher?) {
    this.isLoading = true;
    this.transaction$ = this.ws.get<Apcard[]>('/apcard/', refresher).pipe(
      map(t => this.signTransactions(t)),
      tap(t => this.analyzeTransactions(t)),
      tap(t => this.getTransactionsYears()),
      finalize(() => refresher && refresher.target.complete()),
      finalize(() => (this.isLoading = false))
    );
  }

  openMenu() {
    this.menu.enable(true, 'apcard-filter-menu');
    this.menu.open('apcard-filter-menu');
  }

  closeMenu() {
    this.menu.close('apcard-filter-menu');
  }

  clearFilter() {
    this.filterObject = {
      month: '',
      year: '',
      show: 'all'
    };
    this.closeMenu();
  }
  comingFromTabs() {

    if (this.router.url.split('/')[1].split('/')[0] === 'tabs') {
      return true;
    }
    return false;
  }

}
