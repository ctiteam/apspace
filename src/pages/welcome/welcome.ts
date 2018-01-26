import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LOGINPage } from '../l-ogin/l-ogin';
import { HOMEPage } from '../h-ome/h-ome';
import { Network } from '@ionic-native/network';
import { ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

declare var Connection;
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {


  storeticket: any;
  ticket: any;
  ticket2: any;
  service: any;
  serviceTicket: any;
  respond: any;
  body: any;
  responds: any;
  break: any;
  username: string;
  password: string;
  tgt: any;
  TgtUrl: string;
  onDevice: boolean;


  constructor(public platform: Platform, private network: Network, private toast: ToastController, public navCtrl: NavController, private storage: Storage, public http: Http) {
    this.onDevice = this.platform.is('cordova');
  }

  ionViewDidLoad() {
    this.checknetwork(); //checking network
  }


  checknetwork(){
    document.getElementById("network").innerHTML = 'Checking the connection...';
    if(this.isOnline()){
      this.getStorageOnline();
    }else{
      this.getOfflineStorage();
    }
  }


  isOnline(): boolean {
    if(this.onDevice && this.network.type){
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine; 
    }
  }


  getOfflineStorage() {
    this.storage.get('username').then((val) => {
      this.username = val;
    })

    this.storage.get('password').then((val) => {
      this.password = val;
      this.checkUsernameOffline();
    })

  }


  checkUsernameOffline() {
    if (!this.username && !this.password) {
      this.login();
    } else {
      this.showHome()
    }

  }

  
  getStorageOnline(){

    this.storage.get('username').then((val) => {
      this.username = val;
    })

    this.storage.get('password').then((val) => {
      this.password = val;
    })

    this.storage.get('tgturl').then((val) => {
      this.TgtUrl = val;
      this.checkUsername()
    })

  }


  checkUsername() {
    if (!this.username && !this.password) {
      this.login();
    } else {
      this.checkTgTUrl()
    }
  }


  checkTgTUrl() {  
    if (!this.TgtUrl) {
      this.clearData();  
    } else {
      //Check the username and password
      this.getServiceTicket()
      
    }
  }


  getServiceTicket() {
  
    var headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });
    this.service = 'service=https://cas.apiit.edu.my/cas/login';
    this.http.post(this.TgtUrl, this.service, options)
    .subscribe(res => {
      this.serviceTicket = res.text() 
      document.getElementById("validate").innerHTML = "Validating username and password...";//Validating username and password
      this.validateST();
    }, error => {
      console.log("Error getting Service Ticekt on welcome : " + error);
      
      this.getTgt();
    })
  }


  validateST() {
    var validateUrl = 'https://cas.apiit.edu.my/cas/validate';
    var webService = validateUrl + '?' + this.service + '&ticket=' + this.serviceTicket;
    this.http.get(webService)
    .subscribe(res => {
      this.respond = res; //Access granted
      document.getElementById("granted").innerHTML = "Access Granted!";
      this.showHome();
    }, error => {
      this.getTgt();
      document.getElementById("denied").innerHTML = "Access Denied!";
      console.log("Error validating Service Ticekt on welcome : " + error);
      //Access Denied
      
    })
  }


  getTgt(){
    var headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });

    this.body = 'username='+this.username +  '&password=' + this.password;
    let ticketUrl = 'https://cas.apiit.edu.my/cas/v1/tickets';
    this.http.post(ticketUrl, this.body, options)
    .subscribe(res => {
      this.responds = res.text()
      this.break = this.responds.split("=")[1];
      this.ticket = this.break.split("\"")[1];
      console.log("THIS iS BACK UP pLAN to GET THe TGT");
      
      this.setTGTurlvalue();
    }, error => {
      this.clearData();
    })  
  }


  setTGTurlvalue(){
    this.storage.set('tgturl', this.ticket);
    this.getServiceTicket2(this.ticket);
  }


  getServiceTicket2(val) {
    this.ticket = val
    var headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });
    this.service = 'service=https://cas.apiit.edu.my/cas/login';
    this.http.post(this.ticket, this.service, options)
    .subscribe(res => {
      this.serviceTicket = res.text()
      this.validateST2();
    }, error => {
      this.clearData();
    })
  }


  validateST2() {
    var validateUrl = 'https://cas.apiit.edu.my/cas/validate';
    var webService = validateUrl + '?' + this.service + '&ticket=' + this.serviceTicket;

    this.http.get(webService)
    .subscribe(res => {
      this.respond = res;
      this.showHome();
    }, error => {

      this.clearData();
    })
  }


  clearData() {
    this.storage.clear();
    this.login();
  }


  login() {
    this.navCtrl.setRoot(LOGINPage);
  }


  showHome() {
    this.navCtrl.setRoot(HOMEPage);
  }
}