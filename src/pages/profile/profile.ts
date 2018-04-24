import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { StudentPhoto, StudentProfile } from '../../interfaces';
import { WsApiProvider } from '../../providers';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  photo$: Observable<StudentPhoto[]>;
  profile$: Observable<StudentProfile[]>;

  pages = [
    { title: 'Password Recovery', component: 'PasswordRecoveryPage' }
  ];

  constructor(private ws: WsApiProvider) { }

  ionViewDidLoad() {
    this.photo$ = this.ws.get<StudentPhoto[]>('/student/photo')
    this.profile$ = this.ws.get<StudentProfile[]>('/student/profile');
   }

}
