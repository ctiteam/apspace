import { Component, ViewChild } from "@angular/core";
import { Network } from "@ionic-native/network";
import { Storage } from "@ionic/storage";
import { IonicPage, NavController } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { Platform } from "ionic-angular";
import { MenuController } from "ionic-angular";
import { Events } from "ionic-angular";

import { empty } from "rxjs/observable/empty";
import { catchError, switchMap, tap, timeout, map } from "rxjs/operators";
import { Subscription } from "rxjs/Subscription";

import { Role } from "../../interfaces";
import {
  CasTicketProvider,
  SettingsProvider,
  WsApiProvider
} from "../../providers";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  @ViewChild("autofocus") autofocus;

  username: string;
  password: any;
  showPasswordText: boolean;
  initializers: Subscription[] = [];
  showLoadingSpinner = false;

  constructor(
    public events: Events,
    public menu: MenuController,
    public navCtrl: NavController,
    public plt: Platform,
    public storage: Storage,
    private casTicket: CasTicketProvider,
    private network: Network,
    private settings: SettingsProvider,
    private toastCtrl: ToastController,
    private ws: WsApiProvider
  ) {}

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.menu.enable(true);
  }

  ionViewDidLoad() {
    setTimeout(() => this.autofocus.setFocus(), 150);
  }

  toast(msg: string) {
    this.toastCtrl
      .create({
        message: msg,
        duration: 3000,
        position: "top"
      })
      .present();
  }

  login() {
    this.showLoading();
    if (!this.username || !this.password) {
      this.hideLoading();
      this.toast("Please, fill up username and password");
    } else {
      if (this.plt.is("cordova") && this.network.type === "none") {
        return this.toast("You are now offline.");
      }
      this.casTicket
        .getTGT(this.username, this.password)
        .pipe(
          catchError(
            _ => this.toast("Invalid username or password.") || empty()
          ),
          switchMap(tgt => this.casTicket.getST(this.casTicket.casUrl, tgt)),
          catchError(_ => this.toast("Fail to get service ticket.") || empty()),
          switchMap(st => this.casTicket.validate(st)),
          catchError(_ => {
            this.toast("You are not authorized to use APSpace");
            this.storage.clear();
            return empty();
          }),
          tap(_ =>
            this.cacheApi(
              this.settings.get("role") & Role.Student
                ? ["/student/courses", "/staff/listing"]
                : ["/staff/profile", "/staff/listing"]
            )
          ),
          timeout(30000),
          tap(_ => this.events.publish("user:login"))
        )
        .subscribe(
          _ => {
            this.navCtrl.setRoot("TabsPage");
          },
          _ => {
            this.hideLoading();  
          },
          () => {
            this.hideLoading();
          }
        );
    }
  }

  showLoading() {
    this.showLoadingSpinner = true;
  }

  hideLoading() {
    this.showLoadingSpinner = false;
  }

  cacheApi(data) {
    data.forEach(
      d =>
        (this.initializers[d] = this.ws
          .get(d, true)
          // use .subscribe instead of .take (probably GC collected)
          .subscribe(_ => this.initializers[d].unsubscribe()))
    );
  }

  getPasswordVisibility() {
    return this.showPasswordText ? "text" : "password";
  }
}
