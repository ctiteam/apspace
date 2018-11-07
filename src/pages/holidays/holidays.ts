import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { map, finalize } from 'rxjs/operators';

import { Role } from '../../interfaces';
import { WsApiProvider, SettingsProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-holidays',
  templateUrl: 'holidays.html',
})

export class HolidaysPage {

  holiday$: Observable<any>;

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

    const months = {
      'January': '01',
      'February': '02',
      'March': '03',
      'April': '04',
      'May': '05',
      'June': '06',
      'July': '07',
      'August': '08',
      'September': '09',
      'October': '10',
      'November': '11',
      'December': '12',
    };

    this.holiday$ = this.ws.get<any>(`/transix/holidays`, refresher).pipe(
      map(res => res.holidays),
      map(hh => hh.map(h => {
        let [d, m] = h.holiday_start_date.split('-');
        h.holiday_start_date = `2018-${months[m]}-${('0' + d).slice(-2)}`;
        [d, m] = h.holiday_end_date.split('-');
        h.holiday_end_date = `2018-${months[m]}-${('0' + d).slice(-2)}`;
        return h;
      })),
      finalize(() => refresher && refresher.complete())
    )
  }
}
