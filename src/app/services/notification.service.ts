import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { Observable, from as fromPromise } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CasTicketService } from './cas-ticket.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  serviceUrl = 'http://sns-admin.s3-website-ap-southeast-1.amazonaws.com/';
  APIUrl = 'https://api.apiit.edu.my/dingdong';

  constructor(
    public http: HttpClient,
    // public cas: CasTicketService,
    // public fcm: FCM,
  ) { }

  /**
   * POST: send token and service ticket on Log in and response is the history of notifications
   */
  getMessages(): Observable<any> {
    return this.http.get('http://www.mocky.io/v2/5d41582c3100007e005392ae');
    // let token = '';
    // return fromPromise(this.fcm.getToken()).pipe(
    //   switchMap(
    //     responseToken => {
    //       token = responseToken;
    //       return this.cas.getST(this.serviceUrl);
    //     },
    //   ),
    //   switchMap(
    //     st => {
    //       const body = {
    //         device_token: token,
    //         service_ticket: st,
    //       };
    //       const url = `${this.APIUrl}/client/login`;
    //       return this.http.post(url, body);
    //     },
    //   ),
    // );
  }

  /**
   * POST: send token and service ticket on Log out
   *
   * @param id - user id
   */
  // sendTokenOnLogout(id: string) {
    // this.fcm.getToken().then(d => {
    //   const body = {
    //     client_id: id,
    //     device_token: d,
    //   };
    //   const url = `${this.APIUrl}/client/logout`;
    //   this.http.post(url, body).subscribe();
    // });
  // }

  /**
   * POST: send message id and service ticket
   *
   * @param messageID - id of the notification message
   */
  // sendRead(messageID: any): Observable<any> {
  //   return this.cas.getST(this.serviceUrl).pipe(
  //     switchMap(st => {
  //       const body = {
  //         message_id: messageID,
  //         service_ticket: st,
  //       };
  //       const url = `${this.APIUrl}/client/read`;
  //       return this.http.post(url, body);
  //     }),
  //   );
  // }

  /**
   * Convert message_id to time and date
   *
   * @param epoch - id of the notification message as well as timestamp
   */
  // timeConverter(epoch) {
  //   const d = new Date(epoch * 1000);
  //   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  //   const year = d.getFullYear();
  //   const month = months[d.getMonth()];
  //   const date = d.getDate();
  //   const hour = d.getHours();
  //   let min = d.getMinutes().toString();
  //   min = (+min < 10) ? ('0' + min) : (min);
  //   const time = `${date} ${month} ${year}`;
  //   const timeAndDate = `${date} ${month} ${year} at ${hour}:${min}`;
  //   return [time, timeAndDate];
  // }
}
