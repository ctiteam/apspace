import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { MenuController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { catchError, tap, switchMap } from 'rxjs/operators';

import { CasTicketProvider, WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  @ViewChild('autofocus') autofocus;

  username: string;
  password: string;
  initializers: Observable<any>[] = [];

  constructor(
    public events: Events,
    public menu: MenuController,
    public navCtrl: NavController,
    public plt: Platform,
    private casTicket: CasTicketProvider,
    private network: Network,
    private toastCtrl: ToastController,
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
      tap(_ => this.cacheApi()),
      tap(_ => this.loadProfile()),
    ).subscribe(_ => this.navCtrl.setRoot('HomePage'));
  }

  cacheApi() {
    [
      ['/student/profile', true],
      ['/student/photo', true],
      ['/student/subcourses', true],
      ['/open/weektimetable', false],
      ['/staff/listing', true],
    ].forEach(d =>
      this.initializers[d[0] as string] = this.ws.get(d[0] as string, true,
        { auth: d[1] as boolean, timeout: 10000 })
        // use .subscribe instead of .take (probably GC collected)
        .subscribe(_ => this.initializers[d[0] as string].unsubscribe()));
  }

  loadProfile() {
    this.events.publish('user:login');
  }
}
