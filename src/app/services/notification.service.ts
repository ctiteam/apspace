import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { CasTicketService } from './cas-ticket.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  serviceUrl = 'http://sns-admin.s3-website-ap-southeast-1.amazonaws.com/';
  APIUrl = 'https://21amuch04b.execute-api.ap-southeast-1.amazonaws.com/dev/dingdong';

  constructor(
    public http: HttpClient,
    public cas: CasTicketService,
    public fcm: FCM,
    private platform: Platform
  ) { }

  /**
   * POST: send token and service ticket on Log in and response is the history of notifications
   */
  getMessages(): Observable<any> {
    // return this.http.get('http://www.mocky.io/v2/5d429e813200005900764124');
    let token = '';
    console.log('get messages');
    if (this.platform.is('cordova')) {
      return from(
        this.fcm.getToken()
      ).pipe(
        tap(t => console.log(t)),
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
            const url = `${this.APIUrl}/client/login?ticket=${body.service_ticket}&token=${body.device_token}`;
            return this.http.post(url, {});
          },
        ),
      );
    } else {
      console.log(1);
      return from(of(1)).pipe(
        switchMap(_ => {
          console.log(2);
          return this.cas.getST(this.serviceUrl);
        }),
        switchMap(st => {
          console.log(st);
          const url = `${this.APIUrl}/client/login?ticket=${st}`;
          return this.http.post(url, {});
        })
      );
    }
  }

  /**
   * POST: send token and service ticket on Log out
   *
   * @param id - user id
   */
  sendTokenOnLogout(id: string) {
    this.fcm.getToken().then(d => {
      const body = {
        client_id: id,
        device_token: d,
      };
      const url = `${this.APIUrl}/client/logout`;
      this.http.post(url, body).subscribe();
    });
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
          message_id: messageID,
          service_ticket: st,
        };
        const url = `${this.APIUrl}/client/read`;
        return this.http.post(url, body);
      }),
    );
  }
}
