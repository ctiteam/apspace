import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { NewsService } from './services/news.service';

import { HOMEPage } from '../pages/h-ome/h-ome';
import { RESULTSPage } from '../pages/r-esults/r-esults';
import { FEESPage } from '../pages/f-ees/f-ees';
import { NOTIFICATIONPage } from '../pages/n-otification/n-otification';
import { FEEDBACKPage } from '../pages/f-eedback/f-eedback';
import { LOGINPage } from '../pages/l-ogin/l-ogin';
import { WelcomePage } from '../pages/welcome/welcome';
import { Storage } from '@ionic/storage';
import { AlertController, App } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ToastController } from 'ionic-angular';



@Component({
  templateUrl: 'app.html',
  providers: [NewsService]
})

export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any = WelcomePage;

  photo: any;
  res: any;
  testNav: any;
  tgt: string;
  serv_ticket: string;
  service_url: string = 'service=https://ws.apiit.edu.my/web-services/index.php/student/profile'
  user_info: string;
  validation: any;
 


  constructor(private toastCtrl: ToastController, public app: App, private http: Http, private alertCtrl: AlertController, private storage: Storage, platform: Platform, statusBar: StatusBar, public _platform: Platform) {
    
  }


  goToHOME(params) {
    this.getTGT();
    if (!params) params = {};
    this.navCtrl.setRoot(HOMEPage);
  }

  goToTIMETABLE(params) {
    if (!params) params = {};
    this.navCtrl.setRoot('TimetablePage');
  }

  goToStaffDirectory(params) {
    if (!params) params = {};
    this.navCtrl.setRoot('StaffDirectoryPage');
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
           
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteTGT(this.tgt);
            setTimeout(() => this.storage.clear(), 1500)
            setTimeout(() => this.backToLoginPage(), 1000);
          }
        }
      ]
    });
    alert.present();
  }

  getTGT() {
    this.storage.get('tgturl').then((val) => {
      this.tgt = val;
      console.log("From app:  " + this.tgt )
      this.getServiceTicket(this.tgt);      
    });
  }

  backToLoginPage() {
    this.testNav = this.app.getRootNavById("n4");
    this.testNav.setRoot(LOGINPage);
  }

  deleteTGT(tgt) {
    let options = new RequestOptions({ withCredentials: true });
    this.http.get("https://ws.apiit.edu.my/web-services/index.php/student/close_session", options)
      .subscribe(res => {
        this.res = res;
        

      }, error => {
        console.log("ERRRRROOOOORRR" + error)
      })
  }

  //send tgt to get service ticket
  getServiceTicket(tgt) {
    let headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });
    this.http.post(tgt, this.service_url, options)
      .subscribe(res => {
        this.serv_ticket = res.text();
        this.getUserInfo(this.serv_ticket);
        //this.validateST(this.serv_ticket);
        
      }, error => {
        console.log("Error to get Service Ticket for profile: " + error);
      })
  }



  validateST(serv_ticket) {
    let validation_url = 'https://cas.apiit.edu.my/cas/validate';
    let web_service = validation_url + '?' + this.service_url + '&ticket=' + serv_ticket; //Format to send to validate the Service Ticket
    this.http.get(web_service)
      .subscribe(res => {
        this.validation = res;
       
        this.getUserInfo(serv_ticket);
        
      }, error => {
        console.log(error);
      })
  }

  getUserInfo(serv_ticket) {
    let user_info_api = "https://ws.apiit.edu.my/web-services/index.php/student/profile?ticket=" + serv_ticket;
    let headers = new Headers();
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    this.http.get(user_info_api, options)
      .subscribe(ress => {
        this.user_info = ress.json();
        
        this.storage.set('user_info', this.user_info);
        this.getUserPhoto();
      }, error => {
        console.log("ERRRRRRRRROOOOOOOORRRR: "+ error);
      })
  }


  getUserPhoto() {
    let user_photo_api = "https://ws.apiit.edu.my/web-services/index.php/student/photo";
    let headers = new Headers();
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    this.http.get(user_photo_api, options)
      .subscribe(ress =>
        this.photo = 'data:image/jpg;base64,' + ress.json().base64_photo, console.error
      )
  }
}
