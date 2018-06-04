import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize, tap } from 'rxjs/operators';

import { WsApiProvider } from '../../providers';
import { Apcard } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-apcard',
  templateUrl: 'apcard.html'
})
export class ApcardPage {
  transaction$: Observable<Apcard[]>;
  balance: number;

  constructor(private ws: WsApiProvider) { }

  doRefresh(refresher?) {
    const options = { url: 'https://api.apiit.edu.my' };
    this.transaction$ = this.ws.get<Apcard[]>('/apcard/', true, options).pipe(
      tap(transactions => this.balance = transactions[0].Balance),
      finalize(() => refresher && refresher.complete()),
    );
  }

  ionViewDidLoad() {
    this.doRefresh();
  }
}
