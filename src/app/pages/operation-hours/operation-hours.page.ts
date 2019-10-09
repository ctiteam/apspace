import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { QuixCustomer } from 'src/app/interfaces/quix';
import { WsApiService } from 'src/app/services';
import { finalize, tap, map } from 'rxjs/operators';
import { IonContent } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-operation-hours',
  templateUrl: './operation-hours.page.html',
  styleUrls: ['./operation-hours.page.scss'],

})
export class OperationHoursPage implements OnInit {
  @ViewChild('content', { static: true }) content: IonContent;

  quixCompanies$: Observable<QuixCustomer[]>;
  selectedSegment: 'APU' | 'APIIT' = 'APU';

  constructor(
    private ws: WsApiService,
  ) { }

  ngOnInit() {
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


