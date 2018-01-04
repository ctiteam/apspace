import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NewsService } from './services/news.service';

import { HOMEPage } from '../pages/h-ome/h-ome';
import { TimetablePage } from '../pages/timetable/timetable';
import { StaffDirectoryPage } from '../pages/staff-directory/staff-directory';
import { RESULTSPage } from '../pages/r-esults/r-esults';
import { FEESPage } from '../pages/f-ees/f-ees';
import { NOTIFICATIONPage } from '../pages/n-otification/n-otification';
import { FEEDBACKPage } from '../pages/f-eedback/f-eedback';
import { LOGINPage } from '../pages/l-ogin/l-ogin';
import { WelcomePage } from '../pages/welcome/welcome';
import { Storage } from '@ionic/storage';
import { AlertController, App } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';




@Component({
  templateUrl: 'app.html',
  providers: [NewsService]
})

export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any = WelcomePage;
  

  constructor(public app: App, private http: Http, private alertCtrl: AlertController, private storage: Storage, platform: Platform, statusBar: StatusBar, public _platform: Platform, public _SplashScreen: SplashScreen) {
    this.initializeApp();
    this.getTGT();
  }

  photo: any;

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
    this.navCtrl.setRoot(TimetablePage);
  }

  goToStaffDirectory(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(StaffDirectoryPage);
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
    if (!params) params = {};
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
            this.deleteTGT();
            setTimeout(() => this.storage.clear(), 1500) 
            setTimeout(() => this.backToLoginPage(), 1000);
          }
        }
      ]
    });
    alert.present();
  }

  test2: any;

  getTGT() {
    this.storage.get('tgturl').then((val) => {
      this.test2 = val;
      this.getServiceTicket();
      console.log("GET VALUE   :" + this.test2)
    });
  }

  res: any;
testNav: any;

  backToLoginPage(){
    this.testNav = this.app.getRootNavById("n4");
    this.testNav.setRoot(LOGINPage);
  }

  deleteTGT() {

    this.http.delete(this.test2)
    .subscribe(res =>{
      this.res = res;
      console.log("This is the logout response: " + this.res);
      
    }, error => {
      console.log(error)
    })


  }

  serviceTicket4: any;
  service: any;
  respond5: any;
  ticket: any;




  //send tgt to get service ticket
  getServiceTicket() {
    var headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });
    this.service = 'service=https://ws.apiit.edu.my/web-services/index.php/student/profile';
    this.http.post(this.test2, this.service, options)
      .subscribe(res => {
        this.serviceTicket4 = res.text();
        this.validateST();
        console.log("Service Ticket 4: " + this.serviceTicket4);
      }, error => {
        console.log("Error to get Service Ticket: " + error);
      })
  }
  respond: any;

  validateST() {
    var validateCasUrl = 'https://cas.apiit.edu.my/cas/validate';
    var webService = validateCasUrl + '?' + this.service + '&ticket=' + this.serviceTicket4; //Format to send to validate the Service Ticket
    this.http.get(webService)
      .subscribe(res => {
        this.respond = res;
        this.getUserInfo();
        this.getUserPhoto();
      }, error => {
        console.log('Error message - ST Validation: ' + error);
      })
  }

  respond4: any;
  

  getUserInfo() {
    var url1 = "https://ws.apiit.edu.my/web-services/index.php/student/profile?ticket=" + this.serviceTicket4;
    var headers = new Headers();
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    this.http.get(url1, options)
      .subscribe(ress => {
        this.respond4 = ress.json();
        console.log("this is what we get    :" + this.photo);

      }, error => {
        console.log('Error message' + error);
      })
  }

  getUserPhoto() {
    let url1 = "https://ws.apiit.edu.my/web-services/index.php/student/photo?ticket=" + this.serviceTicket4;
    let headers = new Headers();
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    this.http.get(url1, options)
      .subscribe(ress => {
        this.photo = 'data:image/jpg;base64,' + ress.json().base64_photo;
        console.log("Get photo", this.photo);

      }, error => {
        console.log('Error message' + error);
      })
  }

}
