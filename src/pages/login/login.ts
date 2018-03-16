import { Observable } from 'rxjs/Observable';
import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { MenuController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { CasTicketProvider, WsApiProvider } from '../../providers';

declare var Connection;

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
    public platform: Platform, 
    private network: Network, 
    public navCtrl: NavController, 
    public http: Http, 
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
    if (!this.online) {
      this.toast('You are now offline.');
    }
    setTimeout(() => this.autofocus.setFocus(), 150);
  }

  toast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    }).present();
  }

  get online(): boolean {
    if (this.platform.is('cordova') && this.network.type) {
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  login() {
    if (!this.online) {
      return this.toast('You are now offline.');
    }
    this.casTicket.getTGT(this.username, this.password)
      .catch(_ => this.toast('Invalid username or password.') || Observable.empty())
      .switchMap(tgt => this.casTicket.getST(this.casTicket.casUrl, tgt))
      .catch(_ => this.toast('Fail to get service ticket.') || Observable.empty())
      .do(_ => this.cacheApi())
      .do(_ => this.loadProfile())
      .subscribe(_ => this.navCtrl.setRoot('HomePage'));
  }

  cacheApi() {
    [
      [ '/student/photo', true ],
      [ '/open/weektimetable', false ],
      [ '/student/profile', true ],
      [ '/staff/listing', true ],
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
