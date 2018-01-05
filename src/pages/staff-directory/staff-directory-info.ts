import { Component } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';

import { StaffDirectory } from '../../interfaces/staff-directory';
import { StaffDirectoryProvider } from '../../providers/staff-directory/staff-directory';

@IonicPage({ segment: 'staff/:id' })
@Component({
  selector: 'page-staff-directory-info',
  templateUrl: 'staff-directory-info.html',
})
export class StaffDirectoryInfoPage {

  staff: StaffDirectory;

  constructor(public params: NavParams, public sd: StaffDirectoryProvider) {
    sd.getStaffDirectory().subscribe(
      ss => this.staff = ss.find(s => params.get('id') === s.CODE)
    );
  }

}
