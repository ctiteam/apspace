import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { StudentPhoto, StudentProfile, StaffProfile, Role } from '../../interfaces';
import { WsApiProvider, SettingsProvider } from '../../providers';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  photo$: Observable<StudentPhoto[]>;
  profile$: Observable<StudentProfile[]>;
  staffProfile$: Observable<StaffProfile[]>;

  pages = [
    { title: 'Password Recovery', component: 'PasswordRecoveryPage', icon: 'lock' }
  ];

  constructor(
    private ws: WsApiProvider,
    private settings: SettingsProvider,
  ) { }

  ionViewDidLoad() {
    const role = this.settings.get('role');
    if (role === Role.Student) {
      this.photo$ = this.ws.get<StudentPhoto[]>('/student/photo')
      this.profile$ = this.ws.get<StudentProfile[]>('/student/profile');
    } else if (role === Role.Lecturer || Role.Admin) {
      this.staffProfile$ = this.ws.get<StaffProfile[]>('/staff/profile');
      this.staffProfile$.subscribe(s => console.log(s))
    }
  }
}
