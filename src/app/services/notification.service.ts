import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Badge } from '@ionic-native/badge/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { NotificationHistory } from '../interfaces';
import { CasTicketService } from './cas-ticket.service';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  serviceUrl = 'http://sns-admin.s3-website-ap-southeast-1.amazonaws.com/';
  apiUrl = 'https://api.apiit.edu.my/dingdong';
  apiVersion = 'v2';
  headers = new HttpHeaders().set('version', 'v2');
  constructor(
    public http: HttpClient,
    public cas: CasTicketService,
    public firebaseX: FirebaseX,
    private platform: Platform,
    private network: Network,
    private storage: Storage,
    private badge: Badge
  ) { }

  /**
   * GET: send token and service ticket on Log in and response is the history of notifications
   */
  getMessages(): Observable<NotificationHistory> {
    if (this.network.type !== 'none') {
      let token = '';
      if (this.platform.is('cordova')) {
        return from(
          this.firebaseX.getToken()
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
              const url = `${this.apiUrl}/client/login?ticket=${body.service_ticket}&device_token=${body.device_token}`;
              return this.http.get<NotificationHistory>(url, { headers: this.headers }).pipe(
                tap(notifications => this.storage.set('notifications-cache', notifications)),
              );
            },
          ),
        );
      } else {
        return from(of(1)).pipe( // waiting for dingdong team to finalize the backend APIs
          switchMap(_ => {
            return this.cas.getST(this.serviceUrl);
          }),
          switchMap(st => {
            const url = `${this.apiUrl}/client/login?ticket=${st}`;
            return this.http.get<NotificationHistory>(url, { headers: this.headers }).pipe(
              tap(notifications => this.storage.set('notifications-cache', notifications)),
            );
          })
        );
      }
    } else {
      return from(this.storage.get('notifications-cache'));
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
        this.firebaseX.getToken()
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
            const url = `${this.apiUrl}/client/logout?ticket=${st}`;
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
    if (this.network.type !== 'none') {
      return this.cas.getST(this.serviceUrl).pipe(
        switchMap(st => {
          const body = {
            message_id: messageID
          };
          const url = `${this.apiUrl}/client/read?ticket=${st}`;
          return this.http.post(url, body, { headers: this.headers }).pipe(
            tap(_ => this.badge.decrease(1))
          );
        }),
      );
    } else {
      return from('network none');
    }
  }

  /**
   * Get the list of categories
   *
   *
   */
  getCategories() {
    if (this.network.type !== 'none') {
      const url = `${this.apiUrl}/client/categories`;
      return this.http.get(url, { headers: this.headers }).pipe(
        tap(categories => this.storage.set('dingdong-categories-cache', categories)),
      );
    } else {
      return from(this.storage.get('dingdong-categories-cache'));
    }
  }




  getMessageDetail(messageID): Observable<any> {
    if (this.network.type !== 'none') {
      return this.cas.getST(this.serviceUrl).pipe(
        switchMap(st => {
          const url = `${this.apiUrl}/client/messages/${messageID}?ticket=${st}`;
          return this.http.get(url);
        }),
      );
    } else {
      return from('network none');
    }
  }
}
