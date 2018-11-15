import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { finalize, map } from 'rxjs/operators';

import { Holiday, Holidays, Role } from '../../interfaces';
import { SettingsProvider, WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-holidays',
  templateUrl: 'holidays.html',
})

export class HolidaysPage {

  holiday$: Observable<Holiday[]>;

  numOfSkeletons = new Array(6);
  selectedRole: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ws: WsApiProvider,
    public settings: SettingsProvider,
  ) {
  }

  ionViewDidLoad() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.selectedRole = this.settings.get('role') & Role.Student ? 'students' : 'staff';
    this.holiday$ = this.ws.get<Holidays>(`/transix/holidays`, refresher).pipe(
      map(res => res.holidays),
      finalize(() => refresher && refresher.complete()),
    );
  }
}
