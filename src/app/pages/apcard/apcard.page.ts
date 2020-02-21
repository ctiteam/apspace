import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { WsApiService } from 'src/app/services';
import { Apcard } from '../../interfaces';
import { PrintTransactionsModalPage } from './print-transactions-modal/print-transactions-modal';

@Component({
  selector: 'app-apcard',
  templateUrl: './apcard.page.html',
  styleUrls: ['./apcard.page.scss'],
})
export class ApcardPage implements OnInit {
  transaction$: Observable<Apcard[]>;
  transactions: Apcard[];
  indecitor = false;
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
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.indecitor = true;
  }

  ionViewDidEnter() {
    /*
      * The page's response is very huge, which is causing issues on ios if we use oninit
      * the indecitor is used to define if the page should call the dorefresh of not
      * If we do not use the indecitor, the page in the tabs (tabs/apcard) will be reloading every time we enter the tab
    */
    if (this.indecitor) {
      this.doRefresh();
      this.indecitor = false;
    }
  }
  /** Generating header value (virtual scroll) */
  seperatebyMonth(record: Apcard, recordIndex: number, records: Apcard[]) {
    if (recordIndex === 0) { // first header value - current month
      return format(new Date(record.SpendDate), 'MMMM yyyy').toUpperCase();
    }
    const previousRecordDate = format(new Date(records[recordIndex - 1].SpendDate), 'MMMM yyyy');
    const currentRecordDate = format(new Date(record.SpendDate), 'MMMM yyyy');

    if (previousRecordDate !== currentRecordDate) {
      return currentRecordDate.toUpperCase();
    }
    return null;
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

  doRefresh(refresher?) {
    this.isLoading = true;
    this.transaction$ = this.ws.get<Apcard[]>('/apcard/', refresher).pipe(
      map(transactions => this.signTransactions(transactions)),
      tap(transactions => this.transactions = transactions),
      finalize(() => refresher && refresher.target.complete()),
      finalize(() => (this.isLoading = false))
    );
  }

  comingFromTabs() {
    if (this.router.url.split('/')[1].split('/')[0] === 'tabs') {
      return true;
    }
    return false;
  }

  async generateMonthlyTransactionsPdf() {
    const modal = await this.modalCtrl.create({
      component: PrintTransactionsModalPage,
      componentProps: {
        transactions: this.transactions
      },
      cssClass: 'generateTransactionsPdf',
    });
    await modal.present();
    await modal.onDidDismiss();
  }

}
