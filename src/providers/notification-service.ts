import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { Storage } from '@ionic/storage';

import { CasTicketProvider } from '../providers';

@Injectable()
export class NotificationServiceProvider {

  serviceUrl = "http://sns-admin.s3-website-ap-southeast-1.amazonaws.com/";
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
        console.log('success');
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
      "student_id": studentId,
      "device_token": token
    }
    let url = this.APIUrl + '/student/logout'
    this.http.post(url, body).subscribe(res => {
      console.log('success');
    })
  }

  /**
* GET: Request for notification messages
*
*/
  getNotificationMessages(){
    this.cas.getST(this.serviceUrl).subscribe(st => {
      let url = this.APIUrl + '/student/messages?service_ticket=' + st;
      this.http.get(url).subscribe(res => {
        this.storage.set('messages', res);
      })
    })
  }
}
