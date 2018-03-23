import { Observable } from 'rxjs/Observable';
import { Component, ViewChild } from '@angular/core';
import { AlertController, Events, Nav, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Firebase } from "@ionic-native/firebase";

import { NewsServiceProvider } from '../providers/news-service/news-service';
import { CasTicketProvider, WsApiProvider } from '../providers';
import { NotificationServiceProvider } from '../providers/notification-service/notification-service';
import { UserProfile } from '../interfaces';
import { UserPhoto } from '../interfaces/user-photo';



const NOTIFICATION_URL = "https://zdbuv8iicb.execute-api.ap-southeast-1.amazonaws.com/production/sns_lambda";

@Component({
  templateUrl: 'app.html',
  providers: [NewsServiceProvider]
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;

  activePage: any;
  tgt: any;
  student_id: any;
  device_token: any;

  notification: {
    title: string,
    text: string
  } = {
      "title": "",
      "text": ""
    }

  pages: Array<{
    title: string,
    component: any,
    icon: any
  }>;

  profile$: Observable<UserProfile[]>;
  photo$: Observable<UserPhoto[]>;

  constructor(
    private http: Http,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public events: Events,
    private firebase: Firebase,
    public storage: Storage,
    private cas: CasTicketProvider,
    private ws: WsApiProvider,
    private notificationService: NotificationServiceProvider
  ) {
    this.storage.get('tgt')
      .then(tgt => {
        if (tgt) {
          this.events.subscribe('user:logout', () => this.onLogout());
          this.profile$ = this.ws.get<UserProfile[]>('/student/profile');
          this.photo$ = this.ws.get<UserPhoto[]>('/student/photo')
          this.subscribe();
          this.navCtrl.setRoot('HomePage');
        } else {
          this.events.subscribe('user:login', () => this.onLogin());
          this.navCtrl.setRoot('LoginPage');
        }
      });

    this.pages = [
      { title: 'Home', component: 'HomePage', icon: 'home' },
      { title: 'Timetable', component: 'TimetablePage', icon: 'calendar' },
      { title: 'Staff Directory', component: 'StaffDirectoryPage', icon: 'people' },
      { title: 'Results', component: 'ResultsPage', icon: 'checkbox' },
      { title: 'Notification', component: 'NotificationPage', icon: 'chatbubbles' },
      { title: 'Feedback', component: 'FeedbackPage', icon: 'at' },
    ];

    this.activePage = this.pages[0];
  }

  openPage(page) {
    this.navCtrl.setRoot(page.component);
    this.activePage = page;
  }

  onLogin() {
    this.profile$ = this.ws.get<UserProfile[]>('/student/profile');
    this.photo$ = this.ws.get<UserPhoto[]>('/student/photo');
    this.subscribe();
    this.events.unsubscribe('user:login');
    this.events.subscribe('user:logout', () => this.onLogout());
  }

  onLogout() {
    this.unsubscribe();
    this.ws.get('/student/close_session').subscribe();
    this.cas.deleteTGT().subscribe(_ => {
      // TODO: keep reusable cache
      this.storage.clear();
      this.navCtrl.setRoot('LoginPage');
      this.navCtrl.popToRoot();
    });
    this.events.unsubscribe('user:logout');
    this.events.subscribe('user:login', () => this.onLogin());
  }

  logout() {
    this.alertCtrl.create({
      title: 'Confirm logout',
      message: 'Do you want to logout?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Logout', handler: () => {
            this.events.publish('user:logout');
          }
        },
      ]
    }).present();
  }

  subscribe() {
    this.firebase.onTokenRefresh()
      .subscribe(token => {
        this.storage.set('token', token);
        this.ws.get('/student/profile')
          .subscribe((user_info) => {
            this.cas.getTGT('tgt')
              .subscribe((tgt) => {
                this.notificationService
                  .Subscribe(user_info[0].STUDENT_NUMBER, token, tgt)
              })
          })
      })
    this.firebase.onNotificationOpen()
      .subscribe(notification => this.handleNotification(notification))
  }

  handleNotification(data) {
    this.notification = data;
    this.storage.set('notification', this.notification);
    this.navCtrl.setRoot('NotificationPage')
  }

  unsubscribe() {
    this.cas.getTGT('tgt').subscribe(tgt => {
      this.ws.get('/student/profile')
        .subscribe(user_info => {
          this.storage.get('token')
            .then(token => {
              this.notificationService
                .Unsubscribe(user_info[0].STUDENT_NUMBER, token, tgt)
            })
        })
    })
  }
}
