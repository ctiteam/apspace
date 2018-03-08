import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { LOGINPage } from '../l-ogin/l-ogin';
import { HOMEPage } from '../h-ome/h-ome';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


declare var Connection;

const serviceUrl = 'https://cas.apiit.edu.my';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})


export class WelcomePage {

  storeticket: any;
  ticket: any;
  ticket2: any;
  serviceTicket: any;
  respond: any;
  body: any;
  responds: any;
  break: any;
  username: string;
  password: string;
  tgt: any;
  TgtUrl: string;
  validateServiceTicket: any;
  ser: any;
  val: any;
  onDevice: boolean;


  constructor(
    public events: Events,
    public platform: Platform,
    private network: Network,
    public navCtrl: NavController,
    private storage: Storage,
    public http: Http,
    private authService: AuthServiceProvider) {
    this.onDevice = this.platform.is('cordova');
  }

  ionViewDidLoad() {
    this.checknetwork(); //checking network
  }


  async checknetwork() {
    document.getElementById("network").innerHTML = 'Checking the connection...';

    if (this.isOnline()) {
      await this.storage.get('tgt').then((val) => {
        this.tgt = val;
      })
      if (!this.tgt) {
        this.clearLocalStorage();
        this.navCtrl.setRoot(LOGINPage);
      } else {
        this.serviceTicket = await this.authService.getServiceTicket(serviceUrl, this.tgt);
        console.log(this.serviceTicket);
        this.validateServiceTicket = await this.authService.validateServiceTicket(this.serviceTicket).catch((err) => {
          console.log(err);
        })
        this.loadProfile();
        this.navCtrl.setRoot(HOMEPage);
      }
    } else {
      await this.storage.get('tgt').then((val) => {
        this.tgt = val;
      })
      if(!this.tgt){
        this.clearLocalStorage();
        this.navCtrl.setRoot(LOGINPage);
      }else{
        this.navCtrl.setRoot(HOMEPage);
      }
    }
  }

  //================ONLINE=======================================
  //=============================================================

  isOnline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  loadProfile() {
    this.events.publish('user:login');
  }
  clearLocalStorage() {
    this.storage.clear();
  }
}


  // getServiceTicket(tgt) {
  //   let headers = new Headers();
  //   headers.append('Content-type', 'application/x-www-form-urlencoded');
  //   let options = new RequestOptions({ headers: headers });
  //   this.http.post(tgt, service, options)
  //   .subscribe(res => {
  //     this.serviceTicket = res.text() 
  //     document.getElementById("validate").innerHTML = "Validating username and password...";//Validating username and password
  //     this.validateST(this.serviceTicket);
  //   }, error => {
  //     console.log(error);
  //     this.getTgt();
  //   })
  // }


  // validateST(serviceTicket) {
  //   let webService = validateUrl + '?' + service + '&ticket=' + serviceTicket;
  //   this.http.get(webService)
  //   .subscribe(res => {
  //     this.respond = res; //Access granted
  //     document.getElementById("granted").innerHTML = "Access Granted!";
  //     this.events.publish('user:login');
  //     this.loadProfile();
  //     this.navCtrl.setRoot(HOMEPage);
  //   }, error => {
  //     this.getTgt();
  //     document.getElementById("denied").innerHTML = "Access Denied!";
  //     console.log(error);
  //   })
  // }







  // getTgt(){
  //   this.storage.get('username').then((val) => {
  //     this.username = val;
  //   })

  //   this.storage.get('password').then((val) => {
  //     this.password = val;
  //   })

  //   let headers = new Headers();
  //   headers.append('Content-type', 'application/x-www-form-urlencoded');
  //   let options = new RequestOptions({ headers: headers });
  //   this.body = 'username='+this.username +  '&password=' + this.password;
  //   this.http.post(ticketUrl, this.body, options)
  //   .subscribe(res => {
  //     this.responds = res.text()
  //     this.break = this.responds.split("=")[1];
  //     this.ticket = this.break.split("\"")[1];      
  //     this.storage.set('tgturl', this.ticket);
  //     this.getServiceTicket2(this.ticket);
  //   }, error => {
  //     this.clearData();
  //   })  
  // }

  // getServiceTicket2(val) {
  //   this.ticket = val
  //   let headers = new Headers();
  //   headers.append('Content-type', 'application/x-www-form-urlencoded');
  //   let options = new RequestOptions({ headers: headers });
  //   this.http.post(this.ticket, service, options)
  //   .subscribe(res => {
  //     this.serviceTicket = res.text()
  //     this.validateST2();
  //   }, error => {
  //     this.clearData();
  //   })
  // }

  // validateST2() {
  //   let webService = validateUrl + '?' + service + '&ticket=' + this.serviceTicket;
  //   this.http.get(webService)
  //   .subscribe(res => {
  //     this.respond = res;
  //     this.events.publish('user:login');
  //     this.loadProfile();
  //     this.navCtrl.setRoot(HOMEPage);
  //   }, error => {
  //     this.clearData();
  //   })
  // }

  
  //==========================================================================
  //==========================================================================



  //=======================OFFLINE==============================================
  //============================================================================


  //=========================================================================
  //=========================================================================

 
