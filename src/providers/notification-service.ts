import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { Storage } from '@ionic/storage';

import { CasTicketProvider } from '../providers';
import { StudentProfile } from '../interfaces';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class NotificationServiceProvider {

  serviceUrl = "http://sns-admin.s3-website-ap-southeast-1.amazonaws.com";
  APIUrl = "https://15frgbdxil.execute-api.ap-southeast-1.amazonaws.com/dev";

  constructor(
    public http: HttpClient,
    public cas: CasTicketProvider,
    public fcm: FCM,
    public storage: Storage,
  ) { }

  /**
 * POST: send token and service ticket on Log in
 *
 */
  sendTokenOnLogin() {
    let token = '';
    this.fcm.getToken().then(t => token = t);
    this.cas.getST(this.serviceUrl).subscribe(st => {
      let body = {
        "service_ticket": st,
        "device_token": token
      }
      let url = this.APIUrl + '/student/login'
      this.http.post(url, body).subscribe(res => {
        alert(res);
      })
    })
  }

  /**
* POST: send token and service ticket on Log out
*
*/
  sendTokenOnLogout(studentId: string) {
    let token = '';
    this.fcm.getToken().then(t => token = t);
    let body = {
      "studentId": studentId,
      "device_token": token
    }
    let url = this.APIUrl + '/student/logout'
    this.http.post(url, body).subscribe(res => {
      alert(res);
    })
  }
}
