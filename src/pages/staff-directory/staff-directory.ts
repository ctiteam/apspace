import { Component, HostListener, ViewChild } from '@angular/core';
import { NavController, Searchbar, IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { filter, finalize, map } from 'rxjs/operators';

import { StaffDirectory } from '../../interfaces';
import { WsApiProvider, LoadingControllerProvider } from '../../providers';

@IonicPage({ segment: 'staff' })
@Component({
  selector: 'page-staff-directory',
  templateUrl: 'staff-directory.html',
})
export class StaffDirectoryPage {

  @ViewChild(Searchbar) searchbar: Searchbar;

  term: string = '';
  dept: string = '';
  staff$: Observable<StaffDirectory[]>;
  staffType$: Observable<string[]>;

  constructor(
    public navCtrl: NavController,
    private ws: WsApiProvider,
    public loading: LoadingControllerProvider,
  ) { }

  @HostListener('keydown', ['$event']) onkeydown(e) {
    if (e.keyCode == 13) {
      let activeElement = <HTMLElement>document.activeElement;
      activeElement && activeElement.blur && activeElement.blur();
    }
  }

  doRefresh(refresher?) {
    this.loading.presentLoading();
    this.staff$ = this.ws.get<StaffDirectory[]>('/staff/listing', Boolean(refresher));
    this.staffType$ = this.staff$.pipe(
      filter(ss => ss instanceof Array),
      map(ss => Array.from(new Set(ss.map(s => s.DEPARTMENT))).sort()),
      finalize(() => { refresher && refresher.complete(), this.loading.dismissLoading() }),
    );
  }

  ionViewDidLoad() {
    this.doRefresh();
  }

}
