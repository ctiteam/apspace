import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Checkouts, Fine, History, LatestAdditions } from 'src/app/interfaces/koha';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'app-koha',
  templateUrl: './koha.page.html',
  styleUrls: ['./koha.page.scss'],
})
export class KohaPage implements OnInit {

  checkouts$: Observable<Checkouts>;
  historyList$: Observable<History>;
  recentAdditions$: Observable<LatestAdditions>;
  fine$: Observable<number>;

  selectedSegment: 'checkouts' | 'history' | 'latest-additions' = 'checkouts';


  constructor(
    private ws: WsApiService
  ) { }

  ngOnInit() {
    this.getKohaData();
  }

  getKohaData() {
    this.checkouts$ = this.ws.get<Checkouts>('/koha/checkouts');
    this.historyList$ = this.ws.get<History>('/koha/history');
    this.recentAdditions$ = this.ws.get<LatestAdditions>('/koha/latestadditions');

    // coverting to a number
    this.fine$ = this.ws.get<Fine>('/koha/fine').pipe(
      map(res => {
        return +res.fine;
      })
    );
  }
}
