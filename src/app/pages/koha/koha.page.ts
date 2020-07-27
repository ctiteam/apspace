import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Checkouts, Fines, History, LatestAdditions } from 'src/app/interfaces/koha';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'app-koha',
  templateUrl: './koha.page.html',
  styleUrls: ['./koha.page.scss'],
})
export class KohaPage implements OnInit {

  checkouts$: Observable<Checkouts>;
  historyList$: Observable<History>;
  fines$: Observable<Fines>;
  recentAdditions$: Observable<LatestAdditions>;

  fine: number;
  fineLoading = false;

  selectedSegment: 'checkouts' | 'history' | 'latest-additions' = 'checkouts';

  url = 'https://ousb3s0l8k.execute-api.ap-southeast-1.amazonaws.com/dev/koha';

  constructor(
    private ws: WsApiService
  ) { }

  ngOnInit() {
    this.getKohaData();
    this.getKohaFine();
    this.getKohaDataTest();
 // this.getKohaDataTestProd();
  }

  getKohaData() {
    this.checkouts$ = this.ws.get<Checkouts>('/checkouts', { url: this.url });
    this.historyList$ = this.ws.get<History>('/history', { url: this.url });
    this.recentAdditions$ = this.ws.get<LatestAdditions>('/latestadditions', { url: this.url });
  }

  getKohaFine() {
    this.ws.get<Fines>('/fines', { url: this.url }).subscribe((res) => {
      this.fine = Number(res.fine);
      this.fineLoading = true;
    });
  }

  getKohaDataTest() {
    this.ws.get<Checkouts>('/checkouts', { url: this.url }).pipe(
      tap(res => console.log(res))
    ).subscribe();
    this.ws.get<History>('/history', { url: this.url }).pipe(
      tap(res => console.log(res))
    ).subscribe();
    this.ws.get<Fines>('/fines', { url: this.url }).pipe(
      tap(res => console.log(Number(res.fine)))
    ).subscribe();
    this.ws.get<LatestAdditions>('/latestadditions', { url: this.url }).pipe(
      tap(res => console.log(res))
    ).subscribe();
  }

  getKohaDataTestProd() {
    this.ws.get<Checkouts>('/koha/checkouts').pipe(
      tap(res => console.log(res))
    ).subscribe();
    this.ws.get<History>('/koha/history').pipe(
      tap(res => console.log(res))
    ).subscribe();
    this.ws.get<Fines>('/koha/fines').pipe(
      tap(res => console.log(Number(res.fine)))
    ).subscribe();
    this.ws.get<LatestAdditions>('/koha/latestadditions').pipe(
      tap(res => console.log(res))
    ).subscribe();
  }
}
