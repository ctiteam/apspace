import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { StaffProfile } from '../../interfaces';
import { WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-lecturer-timetable',
  templateUrl: 'lecturer-timetable.html',
})
export class LecturerTimetablePage {

  staffProfile$: Observable<StaffProfile[]>;

  constructor(private ws: WsApiProvider) { }

  ionViewDidLoad() {
    this.staffProfile$ = this.ws.get<StaffProfile[]>('/staff/profile', true);
  }

}
