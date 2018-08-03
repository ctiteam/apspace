import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/observable/fromPromise'
import { CasTicketProvider } from '../providers';

@Injectable()
export class NotificationProvider {

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
 * POST: send token and service ticket on Log in and response is the history of notifications
 *
 */
  getMessage(): Observable<any> {
    let token = '';
    return fromPromise(this.fcm.getToken()).pipe(
      switchMap(
        responseToken => {
          token = responseToken;
          return this.cas.getST(this.serviceUrl)
        }
      ),
      switchMap(
        st => {
          let body = {
            "service_ticket": st,
            "device_token": token
          };
          let url = this.APIUrl + '/client/login';
          return this.http.post(url, body);
        }
      )
    );
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
      let url = this.APIUrl + '/client/logout';
      this.http.post(url, body).subscribe(res => {})
    });
  }

  /**
 * POST: send message id and service ticket
 *
 * @param messageID - id of the notification message
 */
  sendRead(messageID: string): Observable<any>{
    return this.cas.getST(this.serviceUrl).pipe(
      switchMap(st => {
        let body = {
          "message_id": messageID,
          "service_ticket": st
        }
        let url  = this.APIUrl + '/client/read';
        return this.http.post(url, body);
      })
    )
  }

}
