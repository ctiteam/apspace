import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { StaffDirectory } from '../../models/staff-directory';
import { StaffDirectoryProvider } from '../../providers/staff-directory/staff-directory';

@Component({
  selector: 'page-staff-directory',
  templateUrl: 'staff-directory.html',
})
export class StaffDirectoryPage {

  ticket: string;
  listing$: Observable<StaffDirectory[]>;
  private searchTerms = new Subject<string>();

  constructor(
    public navCtrl: NavController,
    public sd: StaffDirectoryProvider
  ) { }

  search(term: string): void {
    console.log(`search ${term}`);
    this.searchTerms.next(term);
  }

  ionViewDidLoad() {
    this.listing$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.sd.searchStaffDirectory(term))
    );
  }

}
