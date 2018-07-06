import { Observable } from "rxjs/Observable";
import { Component, ViewChild } from "@angular/core";
import {
  AlertController,
  Events,
  Platform,
  ToastController,
  MenuController,
  Nav
} from "ionic-angular";
import { forkJoin } from "rxjs/observable/forkJoin";
import { fromPromise } from "rxjs/observable/fromPromise";
import { finalize } from "rxjs/operators";
import { Storage } from "@ionic/storage";
import { Network } from "@ionic-native/network";
import { StatusBar } from '@ionic-native/status-bar';
import { FCM } from '@ionic-native/fcm';

import {
  CasTicketProvider,
  WsApiProvider,
  NotificationServiceProvider,
  LoadingControllerProvider,
  SettingsProvider
} from "../providers";
import {
  StudentPhoto,
  StudentProfile,
  Role,
  StaffProfile
} from "../interfaces";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;

  items: { title: string; text: string }[] = [];

  photo$: Observable<StudentPhoto[]>;
  profile$: Observable<StudentProfile[]>;
  staffProfile$: Observable<StaffProfile[]>;

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
    private loading: LoadingControllerProvider,
    public statusBar: StatusBar,
    public fcm: FCM,
    private settings: SettingsProvider,
  ) {
    this.storage.get("tgt").then(tgt => {
      if (tgt) {
        this.events.subscribe("user:logout", () => this.onLogout());
        const role = this.settings.get('role');
        if (role & Role.Student) {
          this.photo$ = this.ws.get<StudentPhoto[]>("/student/photo");
          this.profile$ = this.ws.get<StudentProfile[]>("/student/profile");
        } else if (role & (Role.Lecturer | Role.Admin)) {
          this.staffProfile$ = this.ws.get<StaffProfile[]>("/staff/profile");
        }
        this.navCtrl.setRoot("TabsPage");
      } else {
        this.events.subscribe("user:login", () => this.onLogin());
        this.navCtrl.setRoot("LoginPage");
      }
    });

    this.platform.ready().then(() => {
      if (this.platform.is("cordova")) {
        this.statusBar.overlaysWebView(false);
        this.fcm.onNotification().subscribe(data => {
          if (data.wasTapped) {
            this.storage.set("items", data);
            this.navCtrl.push("NotificationModalPage", { itemDetails: data });
          } else {
            this.storage.set("items", data);
            this.presentConfirm(data);
          };
        })
      }
    });

    if (this.platform.is("cordova") && this.network.type === "none") {
      this.toastCtrl
        .create({ message: "You are now offline.", duration: 3000 })
        .present();
    }
  }

  onLogin() {
    this.loading.presentLoading();
    if (this.platform.is("cordova")) {
      const role = this.settings.get('role');
      if (role === Role.Student) {
        this.subscribe();
      }
    }
    const role = this.settings.get('role');
    if (role === Role.Student) {
      this.photo$ = this.ws.get<StudentPhoto[]>("/student/photo");
      this.profile$ = this.ws.get<StudentProfile[]>("/student/profile");
    } else if (role === Role.Lecturer || Role.Admin) {
      this.staffProfile$ = this.ws.get<StaffProfile[]>("/staff/profile");
    }
    forkJoin([this.profile$, this.photo$])
      .pipe(finalize(() => this.loading.dismissLoading()))
      .subscribe();
    this.events.unsubscribe("user:login");
    this.events.subscribe("user:logout", () => this.onLogout());
  }

  onLogout() {
    if (this.platform.is("cordova")) {
      const role = this.settings.get('role');
      if (role === Role.Student) {
        this.unsubscribe();
      }
    }

    this.ws.get("/student/close_session").subscribe();
    this.cas.deleteTGT().subscribe(_ => {
      // TODO: keep reusable cache
      this.storage.clear();
      this.navCtrl.setRoot("LoginPage");
      this.navCtrl.popToRoot();
    });
    this.events.unsubscribe("user:logout");
    this.events.subscribe("user:login", () => this.onLogin());
  }

  subscribe() {
    this.notificationService.sendTokenOnLogin();
  }

  unsubscribe() {
    this.ws.get<StudentProfile[]>("/student/profile")
    .subscribe(p => this.notificationService.sendTokenOnLogout(p[0].STUDENT_NUMBER));
  }

  presentConfirm(data) {
    let alert = this.alertCtrl.create({
      title: data.title,
      message: data.body,
      buttons: [
        { text: "Cancel", role: "cancel" },
        {
          text: "Open",
          handler: () => {
            this.navCtrl.push("NotificationModalPage", { itemDetails: data });
          }
        }
      ]
    });
    alert.present();
  }
}
