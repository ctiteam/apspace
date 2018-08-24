import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { ApiApiitProvider } from '../../providers';
import { StaffProfile } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-lecturer-timetable',
  templateUrl: 'lecturer-timetable.html',
})
export class LecturerTimetablePage {

  lecturerId: string;

  constructor(private api_apiit: ApiApiitProvider) { }

  ionViewDidLoad() {
    this.api_apiit.get<StaffProfile[]>('/staff/profile')
      .subscribe(p => this.lecturerId = (p[0] || {} as StaffProfile).EXTENSION);
  }

}
