import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HOMEPage } from '../h-ome/h-ome';
import { Http, Headers, RequestOptions } from '@angular/http';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser'
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';


@Component({
  selector: 'page-l-ogin',
  templateUrl: 'l-ogin.html'
})
export class LOGINPage {
  constructor(private alertCtrl: AlertController,private storage: Storage, public navCtrl: NavController, public http: Http, private inAppBrowser: InAppBrowser, private toastCtrl: ToastController) {

  }

  //url: string = "https://cas.apiit.edu.my/cas/login";

  ticketUrl: string = "https://cas.apiit.edu.my/cas/v1/tickets";


  body: any;
  responds: any;
  break: any;
  public ticket: any;
  serviceTicket: any;
  service: any;
  respond: any;
  intakecode: any;
  public test: any;

  userData = { "username": "", "password": "" };

  getTicket(ticketUrl) {

    var headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });

    this.body = 'username=' + this.userData.username + '&password=' + this.userData.password;

    this.http.post(ticketUrl, this.body, options)
      .subscribe(res => {
        this.responds = res.text()
        console.log(this.responds);
        this.break = this.responds.split("=")[1];
        this.ticket = this.break.split("\"")[1];
        console.log('here is the break final result');
        console.log(this.ticket);
        this.getServiceTicket();
        this.setTGTurlvalue();

      }, error => {
        console.log(error);
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


        console.log("Service Ticket = " + this.serviceTicket);
      })
  }

  validateST() {
    var validateUrl = 'https://cas.apiit.edu.my/cas/validate';
    var webService = validateUrl + '?' + this.service + '&ticket=' + this.serviceTicket;

    this.http.get(webService)
      .subscribe(res => {
        this.respond = res;
        console.log("this is what we get    :" + this.respond);
        this.setvalue();
        this.navCtrl.setRoot(HOMEPage);
      }, error => {
        console.log('Error message' + error);
      })
  }

  setTGTurlvalue() {
    console.log("set value TGT URL    :" + this.ticket)
    this.storage.set('tgturl', this.ticket);

  }

  setvalue() {
    console.log("set value respond:" + this.serviceTicket)
    this.storage.set('ticket', this.serviceTicket);
  }

  getvalue() {
    this.storage.get('ticket').then((val) => {
      this.test = val;
      console.log("GET VALUE   :" + this.test)
    });
  }



presentAlert() {
  let alert = this.alertCtrl.create({
    title: 'Acess Denied',
    subTitle: 'Please check your username and password',
    buttons: ['Dismiss']
  });
  alert.present();
}

  // presentToast(msg) {
  //   let toast = this.toastCtrl.create({
  //     message: msg,
  //     duration: 3000,
  //     position: 'top'
  //   });
  //   toast.present();
  // }
}



//         this.responds = res.text()
//         console.log(this.responds);
//         this.break1 = this.responds.split("=")[1];
//         this.break2 = this.break1.split("\"")[1]
//         console.log(this.break2);



//        var test2 = this.responds.split("=")[1];
//         var test3 = test2.split("\"")[1]
//         console.log(test3);


// 
//     return new Promise ((resolve, reject) =>{
//       this.http.post(casUrl, data, options)
//       .toPromise()
//       .then((response) =>
//       {
//         console.log('API Response : ', response.json());
//         resolve(response.json());
//       })
//       .catch((error) =>
//       {
//         console.error('API Error : ', error.status);
//         console.error('API Error : ', JSON.stringify(error));
//         reject(error.json());
//       });
//     })

//   
//     this.http.post(casUrl, data, options )
//     .subscribe(res => {
//       console.log(res.json());
//     },error =>{
//       console.log(error);
//     })
//     

// 
//   }
//   goToHOME(params){
//     if (!params) params = {};
//     this.navCtrl.push(HOMEPage);
//   }
//   

