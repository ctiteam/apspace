import { Component } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { StatusBar } from '@ionic-native/status-bar';
import {
  AlertController, App, Events, IonicPage, NavController, NavParams, Platform,
  ToastController,
} from 'ionic-angular';

import { Role } from '../../interfaces';
import {SettingsProvider} from '../../providers';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  pages = [
    { title: 'Dashboard', icon: 'podium', root: 'DashboardPage', role: Role.Student },
    { title: 'News', icon: 'home', root: 'NewsPage', role: Role.Lecturer | Role.Admin },
    { title: 'Timetable', icon: 'calendar', root: 'TimetablePage', role: Role.Student },
    { title: 'Timetable', icon: 'calendar', root: 'LecturerTimetablePage', role: Role.Lecturer },
    { title: 'Attendance', icon: 'alarm', root: 'AttendancePage', role: Role.Student },
    { title: 'APCard', icon: 'card', root: 'ApcardPage', role: Role.Student | Role.Lecturer | Role.Admin },
    { title: 'Profile', icon: 'contact', root: 'ProfilePage', role: Role.Lecturer | Role.Admin },
  ];

  morePages = { title: 'More', icon: 'more', root: 'MorePage', role: Role.Student | Role.Lecturer | Role.Admin };

  tabs: Array<{
    title: string,
    icon: string,
    root: string,
    role: Role,
  }>;

  exit = false;
  back = null;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public events: Events,
    public fcm: FCM,
    public navCtrl: NavController,
    public navParams: NavParams,
    public settings: SettingsProvider,
    public statusBar: StatusBar,
    public toastCtrl: ToastController,
    private plt: Platform,
  ) {

    const role = this.settings.get('role');
    this.tabs = this.pages.filter(page => page.role & role).slice(0, 5);

    this.plt.ready().then(() => {
      if (this.plt.is('cordova')) {
        if (this.plt.is('ios')) {
          this.statusBar.backgroundColorByHexString('#4da9ff');
        }
        this.events.subscribe('user:logout', _ => this.back && this.back());
        this.back = this.plt.registerBackButtonAction(() => {
          const overlay = this.app._appRoot._loadingPortal.getActive() ||
            this.app._appRoot._modalPortal.getActive() ||
            this.app._appRoot._overlayPortal.getActive();

          if (overlay && overlay.dismiss) {
            overlay.dismiss();
          } else if (this.app.getRootNav().canGoBack()) {
            this.app.getRootNav().pop();
          } else if (this.exit) {
            this.plt.exitApp();
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
}
