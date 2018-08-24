import { Component } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { map, share } from 'rxjs/operators';

import { StaffDirectory } from '../../interfaces';
import { ApiApiitProvider } from '../../providers';

@IonicPage({ segment: 'staff/:id' })
@Component({
  selector: 'page-staff-directory-info',
  templateUrl: 'staff-directory-info.html',
})
export class StaffDirectoryInfoPage {

  staff$: Observable<StaffDirectory>;

  constructor(public params: NavParams,
    private api_apiit: ApiApiitProvider,) { }

  ionViewDidLoad() {
    this.staff$ = this.api_apiit.get<StaffDirectory[]>('/staff/listing').pipe(
      map(ss => ss.find(s => this.params.get('id') === s.CODE)),
      share()
    );
  }

}
