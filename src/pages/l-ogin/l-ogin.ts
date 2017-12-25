import { Component } from '@angular/core';
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

declare var Connection;
@Component({
  selector: 'page-l-ogin',
  templateUrl: 'l-ogin.html'
})
export class LOGINPage {

 
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
  

  constructor(public menu: MenuController, public platform: Platform, private network: Network, private alertCtrl: AlertController, private storage: Storage, public navCtrl: NavController, public http: Http, private toastCtrl: ToastController) {
    this.onDevice = this.platform.is('cordova');

  }

  ionViewDidEnter() {
    this.menu.enable(false, 'menu1');
  }

  ionViewDidLeave(){
    this.menu.enable(true, 'menu1');
  }
  
  clearStorage(){
    this.storage.clear();
    setTimeout(() => this.checknetwork(), 1000)
  }

  checknetwork(){
    if(this.isOnline()){
   this.getTicket(this.ticketUrl);
    }else{
      this.presentToast();
    }
  }

  isOnline(): boolean {
    if(this.onDevice && this.network.type){
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
      console.log('Dismissed toast');
    });
  
    toast.present();
  }



  getTicket(ticketUrl) {

    var headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });

    this.body = 'username=' + this.userData.username + '&password=' + this.userData.password;

    this.http.post(ticketUrl, this.body, options)
      .subscribe(res => {
        this.responds = res.text()
        this.break = this.responds.split("=")[1];
        this.ticket = this.break.split("\"")[1];
        this.getServiceTicket();
        this.setTGTurlvalue();
      }, error => {
        console.log("Error to get TGT: " + error);
        this.presentAlert();
      })
  }

  getServiceTicket() {
    var headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });
    this.service = 'service=https://cas.apiit.edu.my/cas/login';
    this.http.post(this.ticket, this.service, options)
      .subscribe(res => {
        this.serviceTicket = res.text()
        this.validateST();
      }, error => {
        console.log("Error to get Service Ticket: " + error);
      })
  }

  validateST() {
    var validateCasUrl = 'https://cas.apiit.edu.my/cas/validate';
    var webService = validateCasUrl + '?' + this.service + '&ticket=' + this.serviceTicket; //Format to send to validate the Service Ticket

    this.http.get(webService)
      .subscribe(res => {
        this.respond = res;
        this.saveST();
        this.saveUsername();
        this.savePassword();
        this.navCtrl.setRoot(HOMEPage);
      }, error => {
        console.log('Error message - ST Validation: ' + error);
      })
  }

  //Saves TGT, User Credendials and Service Ticket in Local Storage

  setTGTurlvalue() {
    console.log("save value of TGT URL :" + this.ticket)
    this.storage.set('tgturl', this.ticket);

  }

  saveUsername() {
    console.log("save value of username :" + this.userData.username)
    this.storage.set('username', this.userData.username);

  }

  savePassword() {
    console.log("save value of password :" + this.userData.password)
    this.storage.set('password', this.userData.password);

  }

  saveST() {
    console.log("save value of Service Ticket: " + this.serviceTicket)
    this.storage.set('ticket', this.serviceTicket);
  }

  getST() {
    this.storage.get('ticket').then((val) => {
      this.test = val;
      console.log("GET VALUE   :" + this.test)
    });
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
