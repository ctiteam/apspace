import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { StaffDirectory } from '../../models/staff-directory';

@Component({
  selector: 'page-staff-directory-info',
  templateUrl: 'staff-directory-info.html',
})
export class StaffDirectoryInfoPage {

  staff: StaffDirectory;

  constructor(public params: NavParams) {
    this.staff = params.get('staff');
  }

}
