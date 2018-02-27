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

declare var Connection;
@Component({
  selector: 'page-l-ogin',
  templateUrl: 'l-ogin.html'
})
export class LOGINPage {

  @ViewChild('autofocus') autofocus;

  //Cas Url where username and password are sent
  ticketUrl: string = "https://cas.apiit.edu.my/cas/v1/tickets";

  body: any;                //username and password
  responds: any;
  break: any;
  public ticket: any;       //TGT-ticket
  serviceTicket: any;       //Service Ticket - TGT is sent to get Service Ticket
  service: any;             //Service - in this page is Cas Login Url
  respond: any;             //Used to Vaidate the Service Ticket
  public test: any;
  cred: any;
  onDevice: boolean;


  userData = { "username": "", "password": "" };


  constructor(public events: Events, public menu: MenuController, public platform: Platform, private network: Network, private alertCtrl: AlertController, private storage: Storage, public navCtrl: NavController, public http: Http, private toastCtrl: ToastController) {
    this.onDevice = this.platform.is('cordova');
  }

  ionViewDidEnter() {
    this.menu.enable(false, 'menu1');
  }

  ionViewDidLeave() {
    this.menu.enable(true, 'menu1');
  }

  ionViewDidLoad() {
    setTimeout(() => this.autofocus.setFocus(), 150);
  }

  clearStorage() {
    this.storage.clear();
    setTimeout(() => this.checknetwork(), 1000)
  }

  checknetwork() {
    if (this.isOnline()) {
      this.getTicket();
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
      message: 'You are offline, please connect to network',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }



  getTicket() {
    let headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });

    this.body = 'username=' + this.userData.username + '&password=' + this.userData.password;
    console.log(this.body)
    this.http.post(this.ticketUrl, this.body, options)
      .subscribe(res => {
        this.responds = res.text()
        this.break = this.responds.split("=")[1];
        this.ticket = this.break.split("\"")[1];
        console.log("From login: " + this.ticket)
        this.getServiceTicket(this.ticket);
        this.setTGTurlvalue(this.ticket);
      }, error => {
        console.log(error);
        this.presentAlert();
      })
  }

  getServiceTicket(ticket) {
    let headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });
    this.service = 'service=https://cas.apiit.edu.my/cas/login';
    this.http.post(ticket, this.service, options)
      .subscribe(res => {
        this.serviceTicket = res.text()
        this.validateST(this.serviceTicket);
      }, error => {
        console.log(error);
      })
  }

  validateST(serviceTicket) {
    let validateCasUrl = 'https://cas.apiit.edu.my/cas/serviceValidate';
    let webService = validateCasUrl + '?service=' + this.service + '&ticket=' + serviceTicket; //Format to send to validate the Service Ticket

    this.http.get(webService)
      .subscribe(res => {
        this.respond = res;
        this.saveST();
        this.saveUsername();
        this.loadProfile();
        this.navCtrl.setRoot(HOMEPage);
      }, error => {
        console.log(error);
      })
  }

  loadProfile() {
    this.events.publish('user:login');
  }


  //Saves TGT, User Credendials and Service Ticket in Local Storage

  setTGTurlvalue(ticket) {
    this.storage.set('tgturl', ticket);

  }

  saveUsername() {
    this.storage.set('username', this.userData.username);

  }

  saveST() {
    this.storage.set('ticket', this.serviceTicket);
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
