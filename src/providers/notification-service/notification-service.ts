import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


const NOTIFICATION_URL = "https://zdbuv8iicb.execute-api.ap-southeast-1.amazonaws.com/production/sns_lambda";

@Injectable()
export class NotificationServiceProvider {

  constructor(
    public http: HttpClient) {}

  Subscribe(username, token, tgt){
    let body = 'action=sub&device_token=' + token 
    + '&student_id=' + username + '&tgt=' + tgt;
    this.http.post(NOTIFICATION_URL, body)
    .subscribe(res =>{}), err => {}
  }

  Unsubscribe(username, token, tgt){
    let body = 'action=unsub&device_token=' + token 
    + '&student_id=' + username + '&tgt=' + tgt;
    this.http.post(NOTIFICATION_URL, body)
    .subscribe(res =>{}), err => {}
  }
}
