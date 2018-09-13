import { Component, HostListener, ViewChild } from '@angular/core';
import { IonicPage, NavController, Searchbar } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { filter, finalize, map } from 'rxjs/operators';

import { StaffDirectory } from '../../interfaces';
import { LoadingControllerProvider, WsApiProvider } from '../../providers';

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
    public loading: LoadingControllerProvider,
    private ws: WsApiProvider,
  ) { }

  @HostListener('keydown', ['$event']) onkeydown(e) {
    if (e.keyCode === 13) {
      const activeElement = document.activeElement as HTMLElement;
      activeElement && activeElement.blur && activeElement.blur();
    }
  }

  /** Track staff directory objects. */
  trackById(index: number, item: StaffDirectory): string {
    return item.ID;
  }

  doRefresh(refresher?) {
    this.loading.presentLoading();
    this.staff$ = this.ws.get<StaffDirectory[]>('/staff/listing');
    this.staffType$ = this.staff$.pipe(
      filter(ss => ss instanceof Array),
      map(ss => Array.from(new Set(ss.map(s => s.DEPARTMENT))).sort()),
      finalize(() => { refresher && refresher.complete(), this.loading.dismissLoading(); }),
    );
  }

  ionViewDidLoad() {
    this.doRefresh();
  }

}
