import { Component, HostListener, ViewChild } from '@angular/core';
import { NavController, ModalController, Searchbar, IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import { StaffDirectory } from '../../interfaces/staff-directory';
import { WsApiProvider } from '../../providers/ws-api/ws-api';

@IonicPage({ segment: 'staff' })
@Component({
  selector: 'page-staff-directory',
  templateUrl: 'staff-directory.html',
})
export class StaffDirectoryPage {

  @ViewChild(Searchbar) searchbar: Searchbar;

  term: string = '';
  department: string = '';
  staff$: Observable<StaffDirectory[]>;
  staffType$: Observable<string[]>;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private ws: WsApiProvider,
  ) { }

  @HostListener('keydown', ['$event']) onkeydown(e) {
    if (e.keyCode == 13) {
      let activeElement = <HTMLElement>document.activeElement;
      activeElement && activeElement.blur && activeElement.blur();
    }
  }

  info(staff: StaffDirectory) {
    this.modalCtrl.create('StaffDirectoryInfoPage', { id: staff.CODE }).present();
  }

  selected(staff: StaffDirectory[]): StaffDirectory[] {
    return staff ? (staff).filter(s =>
      (!this.department || [s.DEPARTMENT, s.DEPARTMENT2, s.DEPARTMENT3].indexOf(this.department) !== -1)
      && (s.FULLNAME.toLowerCase().indexOf(this.term.toLowerCase()) !== -1)
    ) : [] as StaffDirectory[];
  }

  doRefresh(refresher) {
    this.staff$ = this.ws.get<StaffDirectory[]>('/staff/listing', Boolean(refresher));
    this.staffType$ = this.staff$.map(ss =>
      Array.from(new Set(ss.map(s => s.DEPARTMENT))))
        .finally(() => refresher && refresher.complete());
  }

  ionViewDidLoad() {
    this.doRefresh();
  }

}
