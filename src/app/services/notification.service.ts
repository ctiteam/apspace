import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Badge } from '@ionic-native/badge/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
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
    private platform: Platform,
    private network: Network,
    private storage: Storage,
    private badge: Badge,
    private push: Push
  ) { }

  checkPushPermission() {
    return this.push.hasPermission().then((res: any) => {
      if (res.isEnabled) {
        this.createPushChannel();
      } else {
        console.log('We do not have permission to send push notifications');
      }
    });
  }

  createPushChannel() {
    this.push.createChannel(
      {
        id: 'apspacepushchannel1',
        description: 'Push channel 1 specifically for android to get messages',
        importance: 3,
        vibration: true
      }
    ).then(() => console.log('channel created for get message'));
  }

  /**
   * GET: send token and service ticket on Log in and response is the history of notifications
   */
  getMessages(): Observable<NotificationHistory> {
    if (this.network.type !== 'none') {
      let token = '';
      if (this.platform.is('cordova')) {
        this.checkPushPermission();

        const options: PushOptions = {
          android: {},
          ios: {
            alert: 'true',
            badge: 'true',
            sound: 'true'
          }
        };

        const pushObject: PushObject = this.push.init(options);
        return pushObject.on('registration').pipe(
          switchMap(
            data => {
              token = data.registrationId;
              console.log('token successfully obtained', token);
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
      this.checkPushPermission();

      const options: PushOptions = {
        android: {},
        ios: {
          alert: 'true',
          badge: 'true',
          sound: 'true'
        }
      };

      const pushObject: PushObject = this.push.init(options);
      return pushObject.on('registration').pipe(
        switchMap(
          data => {
            token = data.registrationId;
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
}
