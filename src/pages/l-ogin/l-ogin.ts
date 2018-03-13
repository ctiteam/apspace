import { Observable } from 'rxjs/Observable';
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HOMEPage } from '../h-ome/h-ome';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { MenuController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { CasTicketProvider } from '../../providers/cas-ticket/cas-ticket';
import { WsApiProvider } from '../../providers/ws-api/ws-api';

declare var Connection;

@Component({
  selector: 'page-l-ogin',
  templateUrl: 'l-ogin.html'
})
export class LOGINPage {

  @ViewChild('autofocus') autofocus;

  username: string;
  password: string;

  constructor(
    public events: Events, 
    public menu: MenuController, 
    public platform: Platform, 
    private network: Network, 
    private storage: Storage, 
    public navCtrl: NavController, 
    public http: Http, 
    private toastCtrl: ToastController,
    private casTicket: CasTicketProvider,
    private ws: WsApiProvider,
  ) { }

  ionViewDidEnter() {
    this.menu.enable(false, 'menu1');
  }

  ionViewDidLeave() {
    this.menu.enable(true, 'menu1');
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
      .do(tgt => this.storage.set('tgturl', `${this.casTicket.casUrl}/cas/v1/tickets/${tgt}`))
      .catch(_ => this.toast('Invalid username or password.') || Observable.empty())
      .switchMap(tgt => this.casTicket.getST(this.casTicket.casUrl, tgt))
      .catch(_ => this.toast('Fail to get service ticket.') || Observable.empty())
      .do(_ => this.loadProfile())
      .do(_ => this.cacheApi())
      .subscribe(_ => this.navCtrl.setRoot(HOMEPage));
  }

  cacheApi() {
    [
      [ '/student/photo', true ],
      [ '/open/weektimetable', false ],
      [ '/student/profile', true ],
      [ '/staff/listing', true ],
    ].forEach(d =>
      this.ws.get(d[0] as string, true, { auth: d[1] as boolean, timeout: 5000 })
      .do(_ => console.log(d[0])).subscribe());
  }

  loadProfile() {
    this.events.publish('user:login');
  }
}
