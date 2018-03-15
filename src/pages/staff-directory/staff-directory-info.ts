import { Component } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';

import { StaffDirectory } from '../../interfaces';
import { WsApiProvider } from '../../providers';

@IonicPage({ segment: 'staff/:id' })
@Component({
  selector: 'page-staff-directory-info',
  templateUrl: 'staff-directory-info.html',
})
export class StaffDirectoryInfoPage {

  staff: StaffDirectory;

  constructor(public params: NavParams, private ws: WsApiProvider) { }

  ionViewDidLoad() {
    this.ws.get<StaffDirectory[]>('/staff/listing').subscribe(
      ss => this.staff = ss.find(s => this.params.get('id') === s.CODE)
    );
  }

}
