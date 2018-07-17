import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { publishLast, refCount } from 'rxjs/operators';

import { CasTicketProvider } from '../providers';
import { Notification } from '../interfaces';

@Injectable()
export class NotificationServiceProvider {

  serviceUrl = "http://sns-admin.s3-website-ap-southeast-1.amazonaws.com/";
  APIUrl = "https://15frgbdxil.execute-api.ap-southeast-1.amazonaws.com/dev";

  url: string = '';

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
      let url = this.APIUrl + '/client/login'
      this.http.post(url, body).subscribe(res => {
        console.log('success');
      })
    })
  }

  /**
* POST: send token and service ticket on Log out
*
* @param id - user id
*/
  sendTokenOnLogout(id: string) {
    this.fcm.getToken().then(t => {
      let body = {
        "client_id": id,
        "device_token": t
      }
      let url = this.APIUrl + '/client/logout'
      this.http.post(url, body).subscribe(res => {
        console.log('success');
      })
    });
  }

  /**
* GET: Request for notification messages
*
* @param refresh - force refresh (default: false)
*/
  getNotificationMessages(refresh?: boolean): Observable<Notification[]> {
    const options = refresh ? { headers: { 'x-refresh': '' } } : {};
    this.cas.getST(this.serviceUrl).subscribe(st => {
      this.url = this.APIUrl + '/client/messages?service_ticket=' + st;
    })
    return this.http.get<Notification[]>(this.url, options).pipe(publishLast(), refCount())
  }
}
