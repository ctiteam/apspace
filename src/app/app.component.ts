import { Observable } from 'rxjs/Observable';
import { Component, ViewChild } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import {
  AlertController, Events, Platform, ToastController,
  MenuController, Nav
} from 'ionic-angular';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { tap, finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';

import { CasTicketProvider, WsApiProvider, NotificationServiceProvider, LoadingControllerProvider } from '../providers';
import { StudentPhoto, StudentProfile } from '../interfaces';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;

  activePage: any;
  items: { title: string, text: string }[] = [];

  pages: Array<{
    title: string,
    component: any,
    icon: any
  }>;

  photo$: Observable<StudentPhoto[]>;
  profile$: Observable<StudentProfile[]>;

  constructor(
    public alertCtrl: AlertController,
    public events: Events,
    public menuCtrl: MenuController,
    public network: Network,
    public storage: Storage,
    public toastCtrl: ToastController,
    private cas: CasTicketProvider,
    private ws: WsApiProvider,
    private notificationService: NotificationServiceProvider,
    private platform: Platform,
    private firebase: Firebase,
    private loading: LoadingControllerProvider
  ) {

    this.storage.get('tgt').then(tgt => {
      if (tgt) {
        this.events.subscribe('user:logout', () => this.onLogout());
        this.photo$ = this.ws.get<StudentPhoto[]>('/student/photo')
        this.profile$ = this.ws.get<StudentProfile[]>('/student/profile');
        this.activePage = this.pages[0];
        this.navCtrl.setRoot('HomePage');
      } else {
        this.events.subscribe('user:login', () => this.onLogin());
        this.navCtrl.setRoot('LoginPage');
      }
    });

    this.pages = [
      { title: 'News', component: 'HomePage', icon: 'home' },
      { title: 'Timetable', component: 'TimetablePage', icon: 'calendar' },
      { title: 'Attendance', component: 'AttendancePage', icon: 'alarm' },
      { title: 'Results', component: 'ResultsPage', icon: 'checkbox' },
      { title: 'Apcard', component: 'ApcardPage', icon: 'card' },
      { title: 'Staff Directory', component: 'StaffDirectoryPage', icon: 'people' },
      { title: 'Fees', component: 'FeesPage', icon: 'cash' },
      { title: 'Notification', component: 'NotificationPage', icon: 'chatbubbles' },
      { title: 'Profile', component: 'ProfilePage', icon: 'contact' },
      { title: 'Operation Hours', component: 'OperationHoursPage', icon: 'information-circle' },
      { title: 'Feedback', component: 'FeedbackPage', icon: 'at' },
    ];

    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.firebase.onNotificationOpen()
          .subscribe(notification => {
            this.storage.get('items').then(data => {
              if (data) {
                this.items = data;
                this.items.splice(0, 0,
                  { title: notification.title, text: notification.text });
                if (this.items.length > 10) {
                  this.items.pop();
                }
                this.storage.set('items', this.items);
                this.presentConfirm(notification.title, notification);
              }
            })
          })
      }
    })

    this.activePage = this.pages[0];

    if (this.platform.is('cordova') && this.network.type === 'none') {
      this.toastCtrl.create({ message: 'You are now offline.', duration: 3000 })
        .present();
    }
  }

  openPage(page) {
    this.navCtrl.setRoot(page.component);
    this.activePage = page;
  }

  openProfile() {
    this.menuCtrl.close();
    this.openPage(this.pages.find(p => p.component === 'ProfilePage'));
  }

  onLogin() {
    this.loading.presentLoading();
    if (this.platform.is('cordova')) {
      this.subscribe();
    }
    this.profile$ = this.ws.get<StudentProfile[]>('/student/profile');
    this.photo$ = this.ws.get<StudentPhoto[]>('/student/photo');
    forkJoin([this.profile$, this.photo$]).pipe(
      finalize(() => this.loading.dismissLoading())
    ).subscribe();
    this.activePage = this.pages[0];
    this.events.unsubscribe('user:login');
    this.events.subscribe('user:logout', () => this.onLogout());
  }

  onLogout() {
    if (this.platform.is('cordova')) {
      forkJoin([
        this.cas.getTGT(),
        this.ws.get('/student/profile'),
        fromPromise(this.storage.get('token')),
      ]).subscribe(d => this.notificationService.Unsubscribe(d[1], d[2], d[0]))
    }

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
    forkJoin([
      this.firebase.onTokenRefresh().pipe(
        tap(token => this.storage.set('token', token))),
      this.ws.get('/student/profile'),
      this.cas.getTGT()
    ]).subscribe(d => {
      this.notificationService.Subscribe(d[1], d[0], d[2])
    })
  }

  presentConfirm(title, notification) {
    let alert = this.alertCtrl.create({
      title: 'New Notification',
      message: title,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Open',
          handler: () => {
            this.navCtrl.push("NotificationModalPage",
              { itemDetails: notification })
          }
        }
      ]
    });
    alert.present();
  }

}

