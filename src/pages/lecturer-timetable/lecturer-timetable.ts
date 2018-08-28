import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { StaffProfile } from '../../interfaces';
import { WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-lecturer-timetable',
  templateUrl: 'lecturer-timetable.html',
})
export class LecturerTimetablePage {

  lecturerId: string;

  constructor(private ws: WsApiProvider) { }

  ionViewDidLoad() {
    this.ws.get<StaffProfile[]>('/staff/profile')
      .subscribe(p => this.lecturerId = (p[0] || {} as StaffProfile).EXTENSION);
  }

}
