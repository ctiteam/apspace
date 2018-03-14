import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { NewsService } from './services/news.service';
import { HomePage } from '../pages/home/home';
import { ResultsPage } from '../pages/results/results';
import { NotificationPage } from '../pages/notification/notification';
import { FeedbackPage } from '../pages/feedback/feedback';
import { LoginPage } from '../pages/login/login';

import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { AlertController, App } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Events } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';
import { WsApiProvider } from '../providers/ws-api/ws-api';
import { UserProfile } from '../interfaces/user-pofile';
import { UserPhoto } from '../interfaces/user-photo';

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
  // rootPage: any = LOGINPage;

  onDevice: boolean;
  connected: Subscription;
  disconnected: Subscription;

  activePage: any;
  photo: any;
  res: any;
  testNav: any;
  tgt: string;
  serv_ticket: string;

  validation: any;
  notificationData: any;
  pages: Array<{ title: string, component: any, icon: any }>;

  user_profile$: Observable<UserProfile>;
  user_photo: string;

  constructor(
    private network: Network,
    public events: Events,
    public app: App,
    private http: Http,
    private alertCtrl: AlertController,
    private storage: Storage,
    public platform: Platform,
    public statusBar: StatusBar,
    public _platform: Platform,
    private ws: WsApiProvider) {

    this.welcome_auth();

    this.events.subscribe('user:login', () => {
      this.onDevice = this.platform.is('cordova');
      //this.getUserProfile()
    })

    //================Slide Menu Navigation======================================
    //===========================================================================

    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home' },
      { title: 'Timetable', component: 'TimetablePage', icon: 'calendar' },
      { title: 'Staff Directory', component: 'StaffDirectoryPage', icon: 'people' },
      { title: 'Results', component: ResultsPage, icon: 'checkbox' },
      { title: 'Notification', component: NotificationPage, icon: 'chatbubbles' },
      { title: 'Feedback', component: FeedbackPage, icon: 'at' }
    ];

    this.activePage = this.pages[0];
  }

  //=============================================================================
  //=============================================================================


 

  welcome_auth() {
    this.storage.get('tgt')
      .then(tgt => {
        if (!tgt) {
          this.navCtrl.setRoot(LoginPage);
        } else {
          //this.getUserProfile();
          this.navCtrl.setRoot(HomePage)
        }
      })
  }

 

  openPage(page) {
    this.navCtrl.setRoot(page.component);
    this.activePage = page;
  }

  checkActive(page) {
    return page == this.activePage;
  }



  logOut() {
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
            this.storage.clear()
            this.navCtrl.setRoot(LoginPage);
          }
        }
      ]
    });
    alert.present();
  }






  get online(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }




  getUserProfile() {
    this.ws.get<UserProfile>('/student/profile')
    .subscribe(userprofile =>{ console.log(userprofile[0].NAME)
    });
    

    // this.ws.get<UserPhoto>('/student/photo')
    // .subscribe(d =>{
    //   this.user_photo = 'data:image/jpg;base64,' + d.base64_photo;
    //   console.log(this.user_photo);
      
    // });
     
  }





  getTGT() {
    this.storage.get('tgturl').then((val) => {
      this.tgt = val;
      console.log("From app2:  " + this.tgt)
      // this.getServiceTicket(this.tgt);
    });
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
}


