import { Component, HostListener, ViewChild } from '@angular/core';
import { NavController, Searchbar, IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize, map } from 'rxjs/operators';

import { StaffDirectory } from '../../interfaces';
import { WsApiProvider } from '../../providers';

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

  constructor(public navCtrl: NavController, private ws: WsApiProvider) { }

  @HostListener('keydown', ['$event']) onkeydown(e) {
    if (e.keyCode == 13) {
      let activeElement = <HTMLElement>document.activeElement;
      activeElement && activeElement.blur && activeElement.blur();
    }
  }

  selected(staff: StaffDirectory[]): StaffDirectory[] {
    return (staff || []).filter(s =>
      (!this.dept || [s.DEPARTMENT, s.DEPARTMENT2, s.DEPARTMENT3].indexOf(this.dept) !== -1)
      && s.FULLNAME.toLowerCase().indexOf(this.term.toLowerCase()) !== -1);
  }

  doRefresh(refresher?) {
    this.staff$ = this.ws.get<StaffDirectory[]>('/staff/listing', Boolean(refresher));
    this.staffType$ = this.staff$.pipe(
      map(ss => Array.from(new Set((ss || []).map(s => s.DEPARTMENT)))),
      finalize(() => refresher && refresher.complete()),
    );
  }

  ionViewDidLoad() {
    this.doRefresh();
  }

}
