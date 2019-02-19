import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { IonicPage } from "ionic-angular";
import * as _ from "lodash";
import { Observable } from "rxjs/Observable";
import { finalize, map, tap } from "rxjs/operators";
import { Apcard } from "../../interfaces";
import { AppAnimationProvider, WsApiProvider } from "../../providers";

@IonicPage()
@Component({
  selector: "page-apcard",
  templateUrl: "apcard.html",
  animations: [
    trigger("flyInOut", [
      state("in", style({ transform: "translateX(0)" })),
      transition("void => *", [
        style({ transform: "translateX(-30%)" }),
        animate(700)
      ]),
      transition("* => void", [
        animate(700, style({ transform: "translateX(30%)" }))
      ])
    ])
  ]
})
export class ApcardPage {
  @ViewChild("apcardBalanceBackground") balanceBackgroundElement: ElementRef;

  transaction$: Observable<Apcard[]>;
  objectKeys = Object.keys; // USED FOR GROUPING TRANSACTIONS PER MONTH
  filterEntry: string = "";
  balance: number;
  monthly: number;
  monthlyTransactions: any;
  monthlyData: any;
  transactionsGroupedByDate: any;
  transactonsYears: string[] = [];
  transactionsMonths: string[] = [];

  numOfSkeletons = new Array(5);
  isLoading: boolean;

  constructor(
    private ws: WsApiProvider,
    private appAnimationProvider: AppAnimationProvider
  ) {}

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
      (tt, t) => {
        const c = t.SpendVal < 0 ? "dr" : "cr"; // classify spent type
        const d = new Date(t.SpendDate);
        d.getFullYear() in tt[c] || (tt[c][d.getFullYear()] = a.slice());
        tt[c][d.getFullYear()][d.getMonth()] += Math.abs(t.SpendVal);

        return tt;
        // default array with current year
      },
      {
        dr: { [now.getFullYear()]: a.slice() },
        cr: { [now.getFullYear()]: a.slice() }
      }
    );

    this.transactionsGroupedByDate = _.mapValues(
      _.groupBy(transactions, item => {
        return (
          new Date(item.SpendDate).getMonth() +
          ", " +
          new Date(item.SpendDate).getFullYear()
        );
      })
    );
    // reverse monthlyData last year
    this.monthly = this.monthlyData.dr[now.getFullYear()][now.getMonth()];    
  }

  /** Negate spend value for top ups. */
  signTransactions(transactions: Apcard[]): Apcard[] {
    transactions.forEach(transaction => {
      if (transaction.ItemName !== "Top Up") {
        transaction.SpendVal *= -1;
      }
    });
    return transactions;
  }

  getTransactionsYears(){
    let firstTransactionYear = this.objectKeys(this.monthlyData.cr)[0];
    let currentYear = new Date().getFullYear();
    for (let year=currentYear; year>=+firstTransactionYear;year--){
      this.transactonsYears.push(year.toString());
    }
    for(let month=11; month>=0;month--){
      this.transactionsMonths.push(month.toString());
    }
  }

  doRefresh(refresher?) {
    this.isLoading = true;
    this.transaction$ = this.ws.get<Apcard[]>("/apcard/", true).pipe(
      map(t => this.signTransactions(t)),
      tap(t => this.analyzeTransactions(t)),
      tap(t => this.getTransactionsYears()),
      finalize(() => refresher && refresher.complete()),
      finalize(() => (this.isLoading = false))
    );
  }

  ionViewDidLoad() {
    this.appAnimationProvider.animateBalanceBackground(this.balanceBackgroundElement);
    this.doRefresh();
  }
}
