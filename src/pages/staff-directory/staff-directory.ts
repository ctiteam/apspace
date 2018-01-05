import { Component, HostListener, ViewChild } from '@angular/core';
import { NavController, ModalController, Searchbar, IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import { StaffDirectory } from '../../interfaces/staff-directory';
import { StaffDirectoryProvider } from '../../providers/staff-directory/staff-directory';

@IonicPage({ segment: 'staff/' })
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
    public sd: StaffDirectoryProvider
  ) { }

  @HostListener('keydown', ['$event']) onkeydown(e) {
    if (e.keyCode == 13) {
      let activeElement = <HTMLElement>document.activeElement;
      activeElement && activeElement.blur && activeElement.blur();
    }
  }

  info(ev: UIEvent, staff: StaffDirectory) {
    if ((<Element>ev.target).tagName !== 'A') {
      this.modalCtrl.create('StaffDirectoryInfoPage', { staff: staff, id: staff.CODE }).present();
    }
  }

  selected(staff: StaffDirectory[]): StaffDirectory[] {
    return staff ? (staff).filter(s =>
      (!this.department || [s.DEPARTMENT, s.DEPARTMENT2, s.DEPARTMENT3].indexOf(this.department) !== -1)
      && (s.FULLNAME.toLowerCase().indexOf(this.term.toLowerCase()) !== -1)
    ) : [] as StaffDirectory[];
  }

  ionViewDidLoad() {
    this.staff$ = this.sd.getStaffDirectory();
    this.staffType$ = this.staff$.map(ss => Array.from(new Set(ss.map(s => s.DEPARTMENT))));
  }

}
