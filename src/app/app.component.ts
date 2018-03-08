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
import { Events } from 'ionic-angular';
import { TimetablePage } from '../pages/timetable/timetable';
import { StaffDirectoryPage } from '../pages/staff-directory/staff-directory';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Subscription } from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';

const service_url = "service=https://ws.apiit.edu.my/web-services/index.php/student/profile";
const close_session_url = "https://ws.apiit.edu.my/web-services/index.php/student/close_session";
const user_info_url = "https://ws.apiit.edu.my/web-services/index.php/student/profile";
const user_photo_url = "https://ws.apiit.edu.my/web-services/index.php/student/photo";


declare var Connection;
@Component({
  templateUrl: 'app.html',
  providers: [NewsService]
})

export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any = WelcomePage;

  onDevice: boolean;
  connected: Subscription;
  disconnected: Subscription;

  activePage: any;
  pages: Array<{ title: string, component: any, icon: any }>;
  photo: any;
  res: any;
  testNav: any;
  tgt: string;
  serv_ticket: string;

  user_info: string;
  validation: any;
  notificationData: any;


  constructor(
    private network: Network,
    private localnotifications: LocalNotifications,
    public events: Events,
    public app: App,
    private http: Http,
    private alertCtrl: AlertController,
    private storage: Storage,
    public platform: Platform,
    public statusBar: StatusBar,
    public _platform: Platform) {

    this.events.subscribe('user:login', () => {
      this.onDevice = this.platform.is('cordova');
      this.checknetwork();
      this._platform.ready().then((rdy) => {
        this.localnotifications.on('click', (notification, state) => {
          let json = JSON.parse(notification.data);
          let alert = this.alertCtrl.create({
            title: notification.title,
            subTitle: json.mydata
          });
          alert.present();
        })

      })
    })

    //================Slide Menu Navigation======================================
    //===========================================================================

    this.pages = [
      { title: 'Home', component: HOMEPage, icon: 'home' },
      { title: 'Timetable', component: TimetablePage, icon: 'calendar' },
      { title: 'Staff Directory', component: StaffDirectoryPage, icon: 'people' },
      { title: 'Results', component: RESULTSPage, icon: 'checkbox' },
      { title: 'Notification', component: NOTIFICATIONPage, icon: 'chatbubbles' },
      { title: 'Feedback', component: FEEDBACKPage, icon: 'at' }
    ];

    this.activePage = this.pages[0];
  }

  //=============================================================================
  //=============================================================================

  openPage(page) {
    this.navCtrl.setRoot(page.component);
    this.activePage = page;
  }

  checkActive(page) {
    return page == this.activePage;
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




  checknetwork() {
    if (this.isOnline()) {
      this.getTGT();
    } else {
      this.loadOfflineUserInfo();
    }
  }

  isOnline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  loadOfflineUserInfo() {
    this.storage.get('user_info').then((val) => {
      this.user_info = val;
      console.log("SUCCCEESSSS" + this.user_info);
      
    });
    this.storage.get('user_photo').then((val) => {
      this.photo = val;
      console.log("SUCESSSSS2" + this.photo);
      
    });
  }


  getTGT() {
    this.storage.get('tgturl').then((val) => {
      this.tgt = val;
      console.log("From app2:  " + this.tgt)
      this.getServiceTicket(this.tgt);
    });
  }

  backToLoginPage() {
    this.testNav = this.app.getRootNavById("n4");
    this.testNav.setRoot(LOGINPage);
  }

  deleteTGT(tgt) {
    let headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ 
      headers: headers,
      withCredentials: true 
    });
    this.http.get(close_session_url, options)
      .subscribe(res => {
        this.res = res;
      }, error => {
      })
  }

  //send tgt to get service ticket
  getServiceTicket(tgt) {
    let headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ 
      headers: headers 
    });
    this.http.post(tgt, service_url, options)
      .subscribe(res => {
        this.serv_ticket = res.text();
        this.getUserInfo(this.serv_ticket);
      }, error => {
        console.log(error);
      })
  }

  getUserInfo(serv_ticket) {
    let user_info_api = user_info_url + "?ticket=" + serv_ticket;
    let headers = new Headers();
    let options = new RequestOptions({ 
      headers: headers, 
      withCredentials: true 
    });
    this.http.get(user_info_api, options)
      .subscribe(ress => {
        this.user_info = ress.json();
        this.storage.set('user_info', this.user_info); //save student'd name and number in local storage
        this.getUserPhoto();
      }, error => {
        console.log(error);
      })
  }

  getUserPhoto() {
    let headers = new Headers();
    let options = new RequestOptions({ 
      headers: headers, 
      withCredentials: true });
    this.http.get(user_photo_url, options)
      .subscribe(ress =>
        this.photo = 'data:image/jpg;base64,' + ress.json().base64_photo, console.error)
        this.storage.set('user_photo', this.photo);
        
  }

  scheduleNotification() {
    this.storage.get('notificationData').then((val) => {
      this.notificationData = val;
      this.localnotifications.schedule({
        id: 1,
        title: this.notificationData[0].title,
        text: this.notificationData[0].text,
        at: new Date(new Date().getTime() + 5 * 1000),
        data: { mydata: 'My hidden message this is' }
      })
    });
  }
}
