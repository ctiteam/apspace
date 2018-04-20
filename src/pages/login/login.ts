import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { MenuController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Subscription } from 'rxjs/Subscription';
import { empty } from 'rxjs/observable/empty';
import { catchError, finalize, tap, timeout, switchMap } from 'rxjs/operators';

import { CasTicketProvider, WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  @ViewChild('autofocus') autofocus;

  cache1 = [
    {path: '/student/profile',    auth: true},
    {path: '/student/photo',      auth: true}
  ];
  cache2 = [
    {path: '/student/subcourses', auth: true},
    {path: '/open/weektimetable', auth: false},
    {path: '/staff/listing',      auth: true}
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
    private loadingCtrl: LoadingController,
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
    //Show loading on Login Button click
    let loading = this.loadingCtrl
    .create({
      content: "Loading...",
      spinner: "crescent"
    });
    loading.present();

    this.casTicket.getTGT(this.username, this.password).pipe(
      catchError(_ => this.toast('Invalid username or password.') || empty()),
      switchMap(tgt => this.casTicket.getST(this.casTicket.casUrl, tgt)),
      catchError(_ => this.toast('Fail to get service ticket.') || empty()),
      switchMap(st => this.casTicket.validate(st)),
      catchError(_ => this.toast('You are not authorized to use iWebspace') || empty()),
      tap(_ => this.cacheApi(this.cache1)),
      timeout(3000),
      finalize(() => loading.dismiss()),
      tap(_ => this.cacheApi(this.cache2)),
    ).pipe(
      tap(_ => this.loadProfile())
    ).subscribe(_ => this.navCtrl.setRoot('HomePage'));
  }

  cacheApi(data) {
    data.forEach(d =>
      this.initializers[d.path] = this.ws.get(d.path, true,
        { auth: d.auth, timeout: 10000 })
      // use .subscribe instead of .take (probably GC collected)
      .subscribe(_ => this.initializers[d.path].unsubscribe()));
  }

  loadProfile() {
    this.events.publish('user:login');
  }

  getPasswordVisibility() {
    return (this.showPasswordText ? "text" : "password");
  }

}
