import { HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { IonContent } from '@ionic/angular';
import * as moment from 'moment';
import { finalize, tap } from 'rxjs/operators';
import { QuixCustomer } from 'src/app/interfaces/quix';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'app-operation-hours',
  templateUrl: './operation-hours.page.html',
  styleUrls: ['./operation-hours.page.scss'],

})
export class OperationHoursPage {
  @ViewChild('content', { static: true }) content: IonContent;
  skeletons = new Array(4);
  quixCompanies$: Observable<QuixCustomer[]>;
  selectedSegment: 'APU' | 'APIIT' = 'APU';

  constructor(
    private ws: WsApiService,
  ) { }

  ionViewDidEnter() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    const header = new HttpHeaders({ 'X-Filename': 'quix-customers' });
    return this.quixCompanies$ = this.ws.get<QuixCustomer[]>('/quix/get/file', refresher, {
      headers: header,
      auth: false
    }
    ).pipe(
      tap(res => res[0].lastModified = moment(res[0].lastModified).add(8, 'hours').format('dddd, Do MMMM YYYY')),
      finalize(() => refresher && refresher.target.complete()),
    );
  }

  segmentValueChanged() {
    this.content.scrollToTop();
  }
}


