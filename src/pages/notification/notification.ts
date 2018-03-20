import { Component } from '@angular/core';
import { NavController, IonicPage, Platform, AlertController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Firebase } from "@ionic-native/firebase";
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/finally';

const NOTIFICATION_URL = "https://jlnowdh399.execute-api.us-west-2.amazonaws.com/prod/sns_lambda";

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})

export class NotificationPage {

  deviceToken: string;
  test: any = []
  notification:
    {
      title: string,
      text: string
    } = {
      "title": "",
      "text": ""
    }

  constructor(
    private http: Http,
    private platform: Platform,
    private firebase: Firebase,
    public navCtrl: NavController,
    private storage: Storage,
    private alertCtrl: AlertController
  ) {

    platform.ready().then(() => {
      this.firebase.onTokenRefresh()
        .subscribe(token => {
          this.storage.get('/student/profile').then((user_info) => {
            this.checkAndSubscribe(user_info[0].STUDENT_NUMBER, token);
            console.log(user_info[0].STUDENT_NUMBER);
          })
        });
      this.firebase.onNotificationOpen().subscribe(notification => this.handleNotification(notification));
    });
  }

  checkAndSubscribe(username, token) {
    this.storage.get('tgt').then(tgt => {
      let body = 'action=sub&device_token=' + token + '&student_id=' + username + '&tgt=' + tgt;
      let headers = new Headers();
      headers.append('Content-type', 'application/x-www-form-urlencoded');
      let options = new RequestOptions({ headers: headers });
      this.http.post(NOTIFICATION_URL, body, options)
        .subscribe(res => {
          console.log("SUCESSSSSSSS: " + res);
        }, err => {
          console.log("ERRRRORR : " + err);
        })
    })
  }

  handleNotification(data) {
    console.log("HANDLE NOTIFICATION");
    this.notification = data;
    this.presentAlert(this.notification)
    //this.test.push(this.notification)
  }


  presentAlert(notification) {
    let alert = this.alertCtrl.create({
      title: notification.title,
      subTitle: notification.text,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
