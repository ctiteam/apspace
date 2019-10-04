import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CasTicketService } from './cas-ticket.service';
import { Platform } from '@ionic/angular';
import { NotificationHistory } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  serviceUrl = 'http://sns-admin.s3-website-ap-southeast-1.amazonaws.com/';
  APIUrl = 'https://api.apiit.edu.my/dingdong';
  apiVersion = 'v2';
  headers = new HttpHeaders().set('version', 'v2');
  constructor(
    public http: HttpClient,
    public cas: CasTicketService,
    public fcm: FCM,
    private platform: Platform
  ) { }

  /**
   * GET: send token and service ticket on Log in and response is the history of notifications
   */
  getMessages(): Observable<NotificationHistory> {
    let token = '';
    if (this.platform.is('cordova')) {
      return from(
        this.fcm.getToken()
      ).pipe(
        switchMap(
          responseToken => {
            token = responseToken;
            return this.cas.getST(this.serviceUrl);
          },
        ),
        switchMap(
          st => {
            const body = {
              device_token: token,
              service_ticket: st,
            };
            const url = `${this.APIUrl}/client/login?ticket=${body.service_ticket}&device_token=${body.device_token}`;
            return this.http.get<NotificationHistory>(url, { headers: this.headers });
          },
        ),
      );
    } else {
      return from(of(1)).pipe( // waiting for dingdong team to finalize the backend APIs
        switchMap(_ => {
          return this.cas.getST(this.serviceUrl);
        }),
        switchMap(st => {
          const url = `${this.APIUrl}/client/login?ticket=${st}`;
          return this.http.get<NotificationHistory>(url, { headers: this.headers });
        })
      );
    }
  }

  /**
   * POST: send token and service ticket on Log out
   *
   * @param id - user id
   */
  sendTokenOnLogout() {
    let token = '';
    if (this.platform.is('cordova')) {
      return from(
        this.fcm.getToken()
      ).pipe(
        switchMap(
          responseToken => {
            token = responseToken;
            return this.cas.getST(this.serviceUrl);
          },
        ),
        switchMap(
          st => {
            const body = {
              device_token: token,
            };
            const url = `${this.APIUrl}/client/logout?ticket=${st}`;
            return this.http.post(url, body, { headers: this.headers });
          },
        ),
      );
    }
  }

  /**
   * POST: send message id and service ticket
   *
   * @param messageID - id of the notification message
   */
  sendRead(messageID: any): Observable<any> {
    return this.cas.getST(this.serviceUrl).pipe(
      switchMap(st => {
        const body = {
          message_id: messageID
        };
        const url = `${this.APIUrl}/client/read?ticket=${st}`;
        return this.http.post(url, body, { headers: this.headers });
      }),
    );
  }

/**
 * Get the list of categories
 *
 *
 */
  getCategories() {
    const url = `${this.APIUrl}/client/categories`;
    return this.http.get(url, {headers: this.headers});
  }
}
