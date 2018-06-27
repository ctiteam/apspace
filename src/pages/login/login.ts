import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { MenuController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Subscription } from 'rxjs/Subscription';
import { empty } from 'rxjs/observable/empty';
import { catchError, tap, timeout, switchMap } from 'rxjs/operators';

import { CasTicketProvider, WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  @ViewChild('autofocus') autofocus;

  cache1 = [
    '/student/profile',
    '/student/photo',
  ];
  cache2 = [
    '/student/courses',
    '/staff/listing',
  ];

  username: string;
  password: string;
  showPasswordText: boolean;
  initializers: Subscription[] = [];

  constructor(
    public events: Events,
    public plt: Platform,
    private network: Network,
    public menu: MenuController,
    public navCtrl: NavController,
    public storage: Storage,
    private toastCtrl: ToastController,
    private casTicket: CasTicketProvider,
    private ws: WsApiProvider,
  ) { }

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
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    }).present();
  }

  login() {
    if (this.plt.is('cordova') && this.network.type === 'none') {
      return this.toast('You are now offline.');
    }

    this.casTicket.getTGT(this.username, this.password).pipe(
      catchError(_ => this.toast('Invalid username or password.') || empty()),
      switchMap(tgt => this.casTicket.getST(this.casTicket.casUrl, tgt)),
      catchError(_ => this.toast('Fail to get service ticket.') || empty()),
      switchMap(st => this.casTicket.validate(st)),
      catchError(_ => {
        this.toast('You are not authorized to use iWebspace');
        this.storage.clear();
        return empty();
      }),
      tap(_ => this.cacheApi(this.cache1)),
      timeout(2000),
      tap(_ => this.cacheApi(this.cache2)),
    ).pipe(
      tap(_ => this.events.publish('user:login'))
    ).subscribe(_ => this.navCtrl.setRoot('TabsPage'));
  }

  cacheApi(data) {
    data.forEach(d => this.initializers[d] = this.ws.get(d, true)
      // use .subscribe instead of .take (probably GC collected)
      .subscribe(_ => this.initializers[d].unsubscribe()));
  }

  getPasswordVisibility() {
    return (this.showPasswordText ? "text" : "password");
  }
}
