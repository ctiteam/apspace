import { Component, ViewChild } from "@angular/core";
import {
  Events,
  Nav,
  Platform,
  ToastController,
  AlertController,
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { Network } from "@ionic-native/network";
import { StatusBar } from '@ionic-native/status-bar';
import { FCM } from '@ionic-native/fcm';

import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';

import {
  CasTicketProvider,
  NotificationProvider,
  SettingsProvider,
  WsApiProvider,
  LoadingControllerProvider
} from "../providers";
import { StudentProfile, StudentPhoto, StaffProfile, Role } from "../interfaces";

@Component({
  templateUrl: "app.html"
})
export class MyApp {

  @ViewChild(Nav) navCtrl: Nav;

  photo$: Observable<StudentPhoto[]>;
  profile$: Observable<StudentProfile[]>;
  staffProfile$: Observable<StaffProfile[]>;

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
  ) {
    this.storage.get("tgt").then(tgt => {
      if (tgt) {
        this.events.subscribe("user:logout", () => this.onLogout());
        this.navCtrl.setRoot("TabsPage");
      } else {
        this.events.subscribe("user:login", () => this.onLogin());
        this.navCtrl.setRoot("LoginPage");
      }
    });

    if (this.platform.is("cordova")) {
      this.statusBar.overlaysWebView(false);
      this.fcm.onNotification().subscribe(data => {
        this.storage.set('test', `${new Date()} ${data.wasTapped}`);
        if (data.wasTapped) {
          this.navCtrl.push("NotificationPage");
        } else {
          this.presentConfirm(data);
        }
      });
      if (this.network.type === "none") {
        this.toastCtrl
          .create({ message: "You are now offline.", duration: 3000 })
          .present();
      }
    }
  }

  onLogin() {
    this.loading.presentLoading();
    if (this.platform.is('cordova')) {
      this.subscribeNotification();
    }
    const role = this.settings.get('role');
    if (role & Role.Student) {
      this.photo$ = this.ws.get<StudentPhoto[]>("/student/photo");
      this.profile$ = this.ws.get<StudentProfile[]>("/student/profile");
    } else if (role & (Role.Lecturer | Role.Admin)) {
      this.staffProfile$ = this.ws.get<StaffProfile[]>("/staff/profile");
    }
    forkJoin([this.profile$, this.photo$])
      .pipe(finalize(() => this.loading.dismissLoading()))
      .subscribe();
    this.events.unsubscribe("user:login");
    this.events.subscribe("user:logout", () => this.onLogout());
  }

  onLogout() {
    if (this.platform.is('cordova')) {
      const role = this.settings.get('role');
      if (role & Role.Student) {
        this.ws.get<StudentProfile[]>("/student/profile").subscribe(p =>
          this.unsubscribeNotification(p[0].STUDENT_NUMBER)
        )
      } else if (role & (Role.Lecturer | Role.Admin)) {
        this.ws.get<StaffProfile[]>("/staff/profile").subscribe(p =>
          this.unsubscribeNotification(p[0].ID)
        )
      }
    }
    const role = this.settings.get('role') & Role.Student ? 'student' : 'staff';
    this.ws.get(`/${role}/close_session`, true, { attempts: 0 }).subscribe();
    this.cas.deleteTGT().subscribe(_ => {
      this.settings.clear();
      // TODO: keep reusable cache
      this.storage.clear();
      this.navCtrl.setRoot("LoginPage");
      this.navCtrl.popToRoot();
    });
    this.events.unsubscribe("user:logout");
    this.events.subscribe("user:login", () => this.onLogin());
  }

  subscribeNotification() {
    this.notificationService.getMessage().subscribe();
  }

  unsubscribeNotification(id: string) {
    this.notificationService.sendTokenOnLogout(id);
  }

  presentConfirm(data) {
    this.alertCtrl.create({
      title: data.title,
      message: data.content,
      buttons: [
        { text: "Cancel", role: "cancel" },
        {
          text: "Open",
          handler: () => { this.navCtrl.push("NotificationModalPage", { itemDetails: data }); }
        }
      ]
    }).present();
  }

}
