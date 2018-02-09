import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Firebase } from "@ionic-native/firebase";
import { Platform } from "ionic-angular";
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/finally';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-n-otification',
  templateUrl: 'n-otification.html'
})
export class NOTIFICATIONPage {

  deviceToken: string;
  token: any;
  user_info: any;
  tgt_url: string;
  tgt: string;
  notification: { title: string, text: string } = { 'title': '', 'text': '' };


  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private http: Http, private platform: Platform, private firebase: Firebase, public navCtrl: NavController, private storage: Storage) {
    this.platform.ready().then(() => {
      this.firebase.onTokenRefresh()
        .subscribe((token: string) =>
          this.setStorageToken(token))
      this.firebase.onNotificationOpen().subscribe(notification => this.handleNotification(notification));
    });
  }


  setStorageToken(token: string) {
    this.deviceToken = token;
    console.log("TOOOOKEEEEN " + this.deviceToken);

    this.storage.set('loggedIn', 'true');
    this.storage.get('loggedIn').then((val) => {
      this.token = val;
      this.loadUserInfo();
    })
  }

  loadUserInfo() {
    this.storage.get('user_info').then((val) => {
      this.user_info = val;
      this.checkAndSubscribe(this.user_info[0].STUDENT_NUMBER);
      console.log("STUDENT NUMBER:  " + this.user_info[0].STUDENT_NUMBER);
    });
  }

  checkAndSubscribe(username: string) {
    if (this.user_info[0].STUDENT_NUMBER == username) {

      this.storage.get('tgturl').then((val) => {
        this.tgt_url = val;
        this.tgt = this.tgt_url.split("/")[6];
        console.log("TGT: " + this.tgt);
     

      let body = 'studentId=' + username + '&tgt=' + this.tgt + '&deviceToken=' + this.deviceToken;
      let headers = new Headers();
      headers.append('Content-type', 'application/x-www-form-urlencoded');
      let options = new RequestOptions({ headers: headers });
      console.log(body);
      console.log("In send place");
      this.http.post('https://jlnowdh399.execute-api.us-west-2.amazonaws.com/prod/sns_subscribe', body, options)
        .subscribe(ress => {
          this.createToast(ress.json().Message)
          
          console.log("RESSSSSPONSE " + JSON.stringify(ress.json()));

        }, err => {
          console.log("LAST STEP ERROR: " + err);

        })
      })


    }
  }

  // validateAndRedirect(message: string) {
  //   // Logic to handle server error should be added here
  //   this.storage.set('loggedIn', 'true');
  // }

  handleNotification(data) {
    this.notification = data;
    this.presentAlert(this.notification);
  }

  presentAlert(notification) {
    let alert = this.alertCtrl.create({
      title: notification.title,
      subTitle: notification.text,
      buttons: ['Dismiss']
    });
    alert.present();
  }



  createToast(text: any) {
    let toast = this.toastCtrl.create({
      message: "No Error",
      duration: 4000,
      position: "bottom"
    });
    toast.present();
    return 1;
  }
}

