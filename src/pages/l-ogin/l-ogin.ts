import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HOMEPage } from '../h-ome/h-ome';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { MenuController } from 'ionic-angular';
import { Body } from '@angular/http/src/body';
import { Events } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CasTicketProvider } from '../../providers/cas-ticket/cas-ticket';

declare var Connection;


const ticketUrl = "https://cas.apiit.edu.my/cas/v1/tickets";
const service = 'service=https://cas.apiit.edu.my/cas/login';
const validateCasUrl = 'https://cas.apiit.edu.my/cas/serviceValidate';

@Component({
  selector: 'page-l-ogin',
  templateUrl: 'l-ogin.html'
})
export class LOGINPage {

  @ViewChild('autofocus') autofocus;

  onDevice: boolean;

  connected: Subscription;
  disconnected: Subscription;


  userCredentails = { "username": "", "password": "" };


  constructor(public events: Events, 
    public menu: MenuController, 
    public platform: Platform, 
    private network: Network, 
    private alertCtrl: AlertController, 
    private storage: Storage, 
    public navCtrl: NavController, 
    public http: Http, 
    private toastCtrl: ToastController,
    private authSerivce: AuthServiceProvider,
    private casTicket: CasTicketProvider) {
    this.onDevice = this.platform.is('cordova');
  }

  ionViewDidEnter() {
    this.menu.enable(false, 'menu1');
    
    this.connected = this.network.onConnect().subscribe(data => {
      this.displayNetworkUpdateOnline(data.type)
    }, error => {
      console.log(error);
    })
    this.disconnected = this.network.onDisconnect().subscribe(data => {
      this.displayNetworkUpdateOffline(data.type)
    }, error => {
      console.log(error);
    })
  }

  ionViewDidLeave() {
    this.menu.enable(true, 'menu1');

    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }

  ionViewDidLoad() {
    setTimeout(() => this.autofocus.setFocus(), 150);
  }


  displayNetworkUpdateOnline(connectionState: string) {
    let networkType = this.network.type;
    const toast_online =  this.toastCtrl.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000,
    }); 
    toast_online.present();
  }


  displayNetworkUpdateOffline(connectionState: string) {
    const toast_offline =  this.toastCtrl.create({
      message: `You are now ${connectionState} `,
      duration: 3000,
    });
    toast_offline.present();
  }


  checknetwork() {
    if (this.isOnline()) {
      this.login();
    } else {
      this.presentToast();
    }
  }

  isOnline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'You are now offline',
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }



  async login(){
    let validateResult = await this.casTicket
      .getTGT(this.userCredentails.username, this.userCredentails.password)
      .first().toPromise();
    if (validateResult){
      this.loadProfile();
      this.navCtrl.setRoot(HOMEPage);
    }
    else{
      this.presentAlert();
    }
    
  }

  loadProfile() {
    this.events.publish('user:login');
  }

  
  //Alerts users that the credentials are wrong
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Access Denied!',
      subTitle: 'Please, re-enter your username or password',
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
