import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Firebase } from "@ionic-native/firebase";
import { Platform } from "ionic-angular";
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/finally';
import { AlertController } from 'ionic-angular';
import { Push } from '@ionic-native/push';
import { Events } from 'ionic-angular';



@Component({
  selector: 'page-n-otification',
  templateUrl: 'n-otification.html'
})
export class NOTIFICATIONPage {


  deviceToken: string;
  token: any;
  user_info1: any;
  tgt_url: string;
  tgt1: string;
  test: any = []
  notification:
    {
      title: string,
      text: string
    } = {
      "title": "",
      "text": ""
    }


   constructor(public events: Events, private push: Push, private alertCtrl: AlertController, private toastCtrl: ToastController, private http: Http, private platform: Platform, private firebase: Firebase, public navCtrl: NavController, private storage: Storage) {
    
    this.platform.ready().then(() => {
        //=======Create the Device Token=============
        this.firebase.onTokenRefresh()
          .subscribe((token: string) =>
            this.setStorageToken(token))
        this.firebase.onNotificationOpen().subscribe(notification => this.handleNotification(notification));
    })
        //===========================================
  }

  setStorageToken(token: string) {
    this.deviceToken = token;


    this.storage.set('loggedIn', 'true');
    this.storage.get('loggedIn').then((val) => {
      this.token = val;
      this.checkAndSubscribe("TP032678");
    })
  }

  loadUserInfo() {
    this.storage.get('user_info').then((val) => {
      this.user_info1 = val;
      this.checkAndSubscribe(this.user_info1[0].STUDENT_NUMBER);
    });
  }

  checkAndSubscribe(username: string) { 
    if ("TP032678" == username) {

      this.storage.get('tgturl').then((val) => {
        this.tgt_url = val;
        this.tgt1 = this.tgt_url.split("/")[6];

        let body = 'action=sub&student_id=' + username + '&tgt=' + this.tgt1 + '&device_token=' + this.deviceToken;
        let headers = new Headers();
        headers.append('Content-type', 'application/x-www-form-urlencoded');
        let options = new RequestOptions({ headers: headers });
        console.log(body);
        console.log("In send place");
        this.http.post('https://jlnowdh399.execute-api.us-west-2.amazonaws.com/prod/sns_subscribe', body, options)
          .subscribe(ress => {
            console.log("SUCESSSSSSSS" + ress);

          }, err => {
            console.log("ERRRRORR : " + err);
          })
      })
    }
  }
  handleNotification(data) {
    this.notification = data;
    this.test.push(this.notification)
    this.storage.set('notificationData', this.test);
  }


}

