import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NewsService } from './services/news.service';

import { HOMEPage } from '../pages/h-ome/h-ome';
import { TIMETABLEPage } from '../pages/t-imetable/t-imetable';
import { RESULTSPage } from '../pages/r-esults/r-esults';
import { FEESPage } from '../pages/f-ees/f-ees';
import { NOTIFICATIONPage } from '../pages/n-otification/n-otification';
import { FEEDBACKPage } from '../pages/f-eedback/f-eedback';
import { LOGINPage } from '../pages/l-ogin/l-ogin';
import { WelcomePage } from '../pages/welcome/welcome';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';




@Component({
  templateUrl: 'app.html',
  providers: [NewsService]
})

export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any = FEEDBACKPage;

  constructor(private http: Http, private alertCtrl: AlertController, private storage: Storage, platform: Platform, statusBar: StatusBar, public _platform: Platform, public _SplashScreen: SplashScreen) {
    this.initializeApp();

  }

    respond4: any = [];


  initializeApp() {
    this._platform.ready().then(() => {
      // do whatever you need to do here.
      setTimeout(() => {
        this._SplashScreen.hide();
      }, 100);
    });
  }


  goToHOME(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(HOMEPage);
  }

  goToTIMETABLE(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(TIMETABLEPage);
  }

  goToRESULTS(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(RESULTSPage);
  }

  goToFEES(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(FEESPage);
  }

  goToNOTIFICATION(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(NOTIFICATIONPage);
  }

  goToFEEDBACK(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(FEEDBACKPage);
  }

  logOut(params) {
    if(!params) params = {};
    this.presentConfirm();
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Log Out',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.storage.clear();
            this.navCtrl.setRoot(LOGINPage);
          }
        }
      ]
    });
    alert.present();
  }


test2 : any;

  getTGT() {
    this.storage.get('tgturl').then((val) => {
      this.test2 = val;
      this.getServiceTicket();
      console.log("GET VALUE   :" + this.test2)
    });
  }

serviceTicket4: any;
service: any;
respond5: any;

  getServiceTicket() {
    var headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });
    this.service = 'service=https://ws.apiit.edu.my/web-services/index.php/student/profile?type=mobile';
    this.http.post(this.test2, this.service, options)
      .subscribe(res => {
        this.serviceTicket4 = res.text()
        this.getUserInfo();
      }, error => {
        console.log("Error to get Service Ticket: " + error);
      })
  }

  getUserInfo() {
    var url1 = "https://ws.apiit.edu.my/web-services/index.php/student/profile?type=mobile";

    let headers = new Headers();
    headers.append('Cookie', 'PHPSESSID');
    let options = new RequestOptions({
      headers: headers,
      withCredentials: true
    })

    this.http.get(url1, options)
      .subscribe(ress => {
        this.respond4 = ress;
        console.log("this is what we get    :" + this.respond4);
      }, error => {
        console.log('Error message' + error);
      })
  }

}
