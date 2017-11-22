import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HOMEPage } from '../h-ome/h-ome';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Injectable } from "@angular/core";


@Component({
  selector: 'page-l-ogin',
  templateUrl: 'l-ogin.html'
})
export class LOGINPage {
  constructor(private alertCtrl: AlertController, private storage: Storage, public navCtrl: NavController, public http: Http, private toastCtrl: ToastController) {

  }

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


  userData = { "username": "", "password": "" };



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
        this.navCtrl.setRoot(HOMEPage);
      }, error => {
        console.log('Error message - ST Validation: ' + error);
      })
  }

  //Saves TGT and Service Ticket in Local Storage

  setTGTurlvalue() {
    console.log("save value of TGT URL :" + this.ticket)
    this.storage.set('tgturl', this.ticket);

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




