import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { Storage } from '@ionic/storage';

import { CasTicketProvider } from '../providers';

@Injectable()
export class NotificationProvider {

  serviceUrl = "http://sns-admin.s3-website-ap-southeast-1.amazonaws.com/";
  APIUrl = "https://15frgbdxil.execute-api.ap-southeast-1.amazonaws.com/dev";

  constructor(
    public http: HttpClient,
    public cas: CasTicketProvider,
    public fcm: FCM,
    public storage: Storage,
  ) { }

  /** POST: Register user for notification. */
  sendTokenOnLogin() {
    this.fcm.getToken().then(token => {
      this.cas.getST(this.serviceUrl).subscribe(st => {
        let body = {
          "service_ticket": st,
          "device_token": token
        };
        this.http.post(this.APIUrl + '/student/login', body).subscribe();
      });
    });
  }

  /** POST: Deregister user for notification. */
  sendTokenOnLogout(studentId: string) {
    this.fcm.getToken().then(token => {
      let body = {
        "student_id": studentId,
        "device_token": token
      };
      this.http.post(this.APIUrl + '/student/logout', body).subscribe();
    });
  }

  /** GET: Request notification messages. */
  getNotificationMessages() {
    this.cas.getST(this.serviceUrl).subscribe(st => {
      let options = { params: { service_ticket: st } };
      this.http.get(this.APIUrl + '/student/messages', options).subscribe();
    });
  }
}
