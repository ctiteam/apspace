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

declare var Connection;

const serviceAPI: string = 'https://cas.apiit.edu.my';


@Component({
  selector: 'page-l-ogin',
  templateUrl: 'l-ogin.html'
})
export class LOGINPage {

  @ViewChild('autofocus') autofocus;

  onDevice: boolean;

  userCredentails = { "username": "", "password": "" };


  constructor(
    public events: Events, 
    public menu: MenuController, 
    public platform: Platform, 
    private network: Network, 
    private storage: Storage, 
    public navCtrl: NavController, 
    public http: Http, 
    private toastCtrl: ToastController,
    private casTicket: CasTicketProvider) {
    this.onDevice = this.platform.is('cordova');
  }

  ionViewDidEnter() {
    this.menu.enable(false, 'menu1');
  }

  ionViewDidLeave() {
    this.menu.enable(true, 'menu1');
  }

  ionViewDidLoad() {
    if (!this.online) {
      this.presentToast('You are now offline.');
    }
    setTimeout(() => this.autofocus.setFocus(), 150);
  }

  presentToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    }).present();
  }

  get online(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  login() {
    if (this.online) {
      this.casTicket
        .getTGT(this.userCredentails.username, this.userCredentails.password)
        .subscribe(
          tgt => {            
            this.storage.set('tgt', tgt);
            this.storage.set('tgturl', `${this.casTicket.casUrl}/cas/v1/tickets/${tgt}`);
            this.casTicket.getST(serviceAPI, tgt).subscribe(
              st => this.casTicket.validateST(serviceAPI, st).subscribe(
                _ => { this.loadProfile(); this.navCtrl.setRoot(HOMEPage); },
                _ => this.presentToast('Fail to validate service ticket.')
              ),
              err => this.presentToast('Fail to get service ticket.')
            );
          },
          err => this.presentToast('Invalid credentails.')
        );
    } else {
      this.presentToast('You are now offline.');
    }
  }
  
  loadProfile() {
    this.events.publish('user:login');
  }
}
