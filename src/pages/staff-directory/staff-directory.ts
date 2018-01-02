import { Component, HostListener, ViewChild } from '@angular/core';
import { NavController, ModalController, Searchbar } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import { StaffDirectory } from '../../models/staff-directory';
import { StaffDirectoryInfoPage } from './staff-directory-info';
import { StaffDirectoryProvider } from '../../providers/staff-directory/staff-directory';

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
      this.modalCtrl.create(StaffDirectoryInfoPage, { staff: staff }).present();
    }
  }

  which(department: string) {
    return (ss: StaffDirectory[]): StaffDirectory[] =>
      ss.filter(s => !department ||
        [s.DEPARTMENT, s.DEPARTMENT2, s.DEPARTMENT3].indexOf(department) !== -1);
  }

  search(term: string) {
    return (ss: StaffDirectory[]): StaffDirectory[] =>
      ss.filter(s => s.FULLNAME.toLowerCase().indexOf(term.toLowerCase()) !== -1);
  }

  ionViewDidLoad() {
    this.staff$ = this.sd.getStaffDirectory();
    this.staffType$ = this.staff$.map(ss => Array.from(new Set(ss.map(s => s.DEPARTMENT))));
  }

}
