import { Component } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import {
  AlertController, App, Events, IonicPage, NavController, NavParams, Platform,
  ToastController,
} from 'ionic-angular';

import { Role } from '../../interfaces';
import {
  LoadingControllerProvider, NotificationProvider, SettingsProvider,
} from '../../providers';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  pages = [
    { title: 'News', icon: 'home', root: 'HomePage', role: Role.Student | Role.Lecturer | Role.Admin },
    { title: 'Timetable', icon: 'calendar', root: 'TimetablePage', role: Role.Student },
    { title: 'Timetable', icon: 'calendar', root: 'LecturerTimetablePage', role: Role.Lecturer },
    { title: 'Attendance', icon: 'alarm', root: 'AttendancePage', role: Role.Student },
    { title: 'APCard', icon: 'card', root: 'ApcardPage', role: Role.Student | Role.Lecturer | Role.Admin },
    { title: 'Bus Tracking', icon: 'bus', root: 'BusTrackingPage', role: Role.Lecturer | Role.Admin },
  ];

  morePages = { title: 'More', icon: 'ios-more', root: 'MorePage', role: Role.Student | Role.Lecturer | Role.Admin };

  tabs: Array<{
    title: string,
    icon: string,
    root: string,
    role: Role,
  }>;

  exit = false;
  back = null;

  badge: string;

  constructor(
    public navParams: NavParams,
    public statusBar: StatusBar,
    public navCtrl: NavController,
    private plt: Platform,
    public settings: SettingsProvider,
    public alertCtrl: AlertController,
    public fcm: FCM,
    public events: Events,
    public app: App,
    private loading: LoadingControllerProvider,
    public toastCtrl: ToastController,
    public storage: Storage, // XXX
    public notification: NotificationProvider,
  ) {

    const role = this.settings.get('role');
    this.tabs = this.pages.filter(page => page.role & role).slice(0, 4);

    this.events.subscribe('newNotification', () => {
      this.getBadge();
    });

    this.plt.ready().then(() => {
      if (this.plt.is('cordova')) {
        this.statusBar.backgroundColorByHexString('#4da9ff');
        this.events.subscribe('user:logout', _ => this.back && this.back());
        this.back = this.plt.registerBackButtonAction(() => {
          if (this.app.getRootNav().canGoBack()) {
            this.app.getRootNav().pop();
          } else if (this.exit) {
            this.plt.exitApp();
          } else if (this.loading.dismissLoading()) {
            this.loading.dismissLoading();
          } else {
            const toast = this.toastCtrl.create({
              message: 'Tap again to exit.',
              cssClass: 'normalToast',
              duration: 2000,
              position: 'top',
            });
            this.exit = true;
            toast.onDidDismiss(() => this.exit = false);
            toast.present();
          }
        });
      }
    });
  }

  ionViewWillEnter() {
    if (this.plt.is('cordova')) {
      this.getBadge();
    }
  }

  getBadge() {
    this.notification.getMessage().subscribe(res => {
      this.badge = res.num_of_unread_msgs;
    });
  }
}
