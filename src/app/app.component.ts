import { Component, ViewChild } from "@angular/core";
import {
  AlertController, Events, MenuController, Nav, Platform, ToastController
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { Network } from "@ionic-native/network";
import { StatusBar } from '@ionic-native/status-bar';
import { FCM } from '@ionic-native/fcm';

import {
  CasTicketProvider, NotificationServiceProvider, SettingsProvider,
  WsApiProvider
} from "../providers";
import { StudentProfile, Role } from "../interfaces";

@Component({
  templateUrl: "app.html"
})
export class MyApp {

  @ViewChild(Nav) navCtrl: Nav;

  constructor(
    public alertCtrl: AlertController,
    public events: Events,
    public fcm: FCM,
    public menuCtrl: MenuController,
    public network: Network,
    public statusBar: StatusBar,
    public storage: Storage,
    public toastCtrl: ToastController,
    private cas: CasTicketProvider,
    private notificationService: NotificationServiceProvider,
    private platform: Platform,
    private settings: SettingsProvider,
    private ws: WsApiProvider,
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
    this.events.unsubscribe("user:login");
    this.events.subscribe("user:logout", () => this.onLogout());
  }

  onLogout() {
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

  subscribe() {
    this.notificationService.sendTokenOnLogin();
  }

  unsubscribe() {
    this.ws.get<StudentProfile[]>("/student/profile")
      .subscribe(p => this.notificationService.sendTokenOnLogout(p[0].STUDENT_NUMBER));
  }

  presentConfirm(data) {
    this.alertCtrl.create({
      title: data.title,
      message: data.body,
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
