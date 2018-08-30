import { Component, ViewChild } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import {
  AlertController,
  Events,
  Nav,
  Platform,
  ToastController,
} from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize } from 'rxjs/operators';

import { Role, StaffProfile, StudentPhoto, StudentProfile } from '../interfaces';
import {
  CasTicketProvider,
  DataCollectorProvider,
  LoadingControllerProvider,
  NotificationProvider,
  SettingsProvider,
  WsApiProvider,
} from '../providers';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {

  @ViewChild(Nav) navCtrl: Nav;

  photo$: Observable<StudentPhoto[]>;
  profile$: Observable<StudentProfile[]>;
  staffProfile$: Observable<StaffProfile[]>;
  notification: any;

  constructor(
    public events: Events,
    public network: Network,
    public statusBar: StatusBar,
    public storage: Storage,
    public toastCtrl: ToastController,
    private notificationService: NotificationProvider,
    private platform: Platform,
    private settings: SettingsProvider,
    private ws: WsApiProvider,
    private loading: LoadingControllerProvider,
    private cas: CasTicketProvider,
    private alertCtrl: AlertController,
    private fcm: FCM,
    private dataCollector: DataCollectorProvider,
  ) {
    this.platform.ready().then(() => {
      this.storage.get('tgt').then(tgt => {
        if (tgt) {
          if (this.platform.is('cordova')) {
            this.notificationService.getMessage().subscribe();
          }
          this.events.subscribe('user:logout', () => this.onLogout());
          this.navCtrl.setRoot('TabsPage');
          if (this.notification) {
            this.notificationService.sendRead(parseInt(this.notification.message_id, 10)).subscribe(_ => {
              this.navCtrl.push('NotificationModalPage', { itemDetails: this.notification });
            });
          }
        } else {
          this.events.subscribe('user:login', () => this.onLogin());
          this.navCtrl.setRoot('LoginPage');
        }
      });

      if (this.platform.is('cordova')) {
        this.statusBar.overlaysWebView(false);
        this.fcm.onNotification().subscribe(data => {
          if (data.wasTapped) {
            this.notification = data;
          } else {
            this.presentConfirm(data);
            this.events.publish('newNotification');
          }
        });
        if (this.network.type === 'none') {
          this.toastCtrl
            .create({ message: 'You are now offline.', duration: 3000 })
            .present();
        }
      }
    });
  }

  onLogin() {
    this.loading.presentLoading();
    if (this.platform.is('cordova')) {
      forkJoin(
        [
          this.notificationService.getMessage(),
          this.dataCollector.sendDeviceInfo(),
        ]).subscribe();
    }
    const role = this.settings.get('role');
    if (role & Role.Student) {
      this.photo$ = this.ws.get<StudentPhoto[]>('/student/photo');
      this.profile$ = this.ws.get<StudentProfile[]>('/student/profile');
      forkJoin([this.profile$, this.photo$])
        .pipe(finalize(() => this.loading.dismissLoading()))
        .subscribe();
    } else if (role & (Role.Lecturer | Role.Admin)) {
      this.staffProfile$ = this.ws.get<StaffProfile[]>('/staff/profile', false, { url: 'https://api.apiit.edu.my' });
      this.staffProfile$
        .pipe(finalize(() => this.loading.dismissLoading()))
        .subscribe();
    }
    this.events.unsubscribe('user:login');
    this.events.subscribe('user:logout', () => this.onLogout());
  }

  onLogout() {
    if (this.platform.is('cordova')) {
      const role = this.settings.get('role');
      if (role & Role.Student) {
        this.ws.get<StudentProfile[]>('/student/profile').subscribe(p => {
          this.unsubscribeNotification(p[0].STUDENT_NUMBER);
          this.logout();
        });
      } else if (role & (Role.Lecturer | Role.Admin)) {
        this.ws.get<StaffProfile[]>('/staff/profile', false, { url: 'https://api.apiit.edu.my' }).subscribe(p => {
          this.unsubscribeNotification(p[0].ID);
          this.logout();
        });
      }
    } else {
      this.logout();
    }
  }

  logout() {
    const role = this.settings.get('role') & Role.Student ? 'student' : 'staff';
    this.ws.get(`/${role}/close_session`, true, { attempts: 0 }).subscribe();
    this.cas.deleteTGT().subscribe(_ => {
      this.settings.clear();
      // TODO: keep reusable cache
      this.storage.clear();
      this.navCtrl.setRoot('LoginPage');
      this.navCtrl.popToRoot();
    });
    this.events.unsubscribe('user:logout');
    this.events.subscribe('user:login', () => this.onLogin());
  }

  unsubscribeNotification(id: string) {
    this.notificationService.sendTokenOnLogout(id);
  }

  presentConfirm(data) {
    this.alertCtrl.create({
      title: data.title,
      message: data.content.substring(0, 70) + '...',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Open',
          handler: () => {
            this.notificationService.sendRead(parseInt(data.message_id, 10)).subscribe(_ => {
              this.navCtrl.push('NotificationModalPage', { itemDetails: data });
            });
          },
        },
      ],
    }).present();
  }
}
