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


@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {


  connected: Subscription;
  disconnected: Subscription;

  storeticket: any;
  ticket: any;
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


  constructor(private toast: ToastController, private network: Network, public navCtrl: NavController, private storage: Storage, public http: Http) {

  }

  ionViewDidLoad() {
   this.checkUsername();
  }

  networkConnection() {
    this.connected = this.network.onConnect().subscribe(data => {
      this.displayNetworkUpdate(data.type);
      this.checkUsername();
      console.log(data)
    }, error => console.error(error));


    this.disconnected = this.network.onDisconnect().subscribe(data => {
      this.displayNetworkUpdate(data.type);
      this.checkUsername2();
      console.log(data)
    }, error => console.error(error));

    // stop connect watch
    //connectSubscription.unsubscribe();
  }

  displayNetworkUpdate(connectionState: string) {
    let networkType = this.network.type;

    this.toast.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 5000
    }).present();
  }


  checkUsername() {
    this.storage.get('username').then((val) => {
      this.username = val;

      this.storage.get('password').then((val) => {
        this.password = val;

        if (!this.username && !this.password) {
          this.login();
        } else {

          this.checkTgTUrl()
        }
      })

    })

  }

  checkUsername2() {
    this.storage.get('username').then((val) => {
      this.username = val;

      this.storage.get('password').then((val) => {
        this.password = val;

        if (!this.username && !this.password) {
          this.login();
        } else {
          this.showHome();
        }
      })

    })

  }

  checkTgTUrl() {
    this.storage.get('tgturl').then((val) => {
      this.TgtUrl = val;


      if (!this.TgtUrl) {
        this.clearData();
      } else {
        this.getServiceTicket()
      }
    })

  }

  getServiceTicket() {

    this.storage.get('tgturl').then((val) => {
      this.storeticket = val
    })


    this.ticket = this.storeticket


    var headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });

    this.service = 'service=https://cas.apiit.edu.my/cas/login';




    this.http.post(this.ticket, this.service, options)
      .subscribe(res => {
        this.serviceTicket = res.text()
        this.validateST();
        console.log("Service Ticket = " + this.serviceTicket);
      }, error => {
        this.getTgt();
      })
  }



  validateST() {
    var validateUrl = 'https://cas.apiit.edu.my/cas/validate';
    var webService = validateUrl + '?' + this.service + '&ticket=' + this.serviceTicket;

    this.http.get(webService)
      .subscribe(res => {
        this.respond = res;
        //this.presentAlertdone();
        this.showHome();
        console.log("this is what we get  :" + this.respond);


      }, error => {

        this.getTgt();

        console.log('Error message' + error);
      })
  }



  getTgt() {

    var headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });

    this.body = 'username=TP034790' + '&password=TP034790';
    let ticketUrl = 'https://cas.apiit.edu.my/cas/v1/tickets';
    this.http.post(ticketUrl, this.body, options)
      .subscribe(res => {
        this.responds = res.text()
        console.log(this.responds);
        this.break = this.responds.split("=")[1];
        this.ticket = this.break.split("\"")[1];
        console.log('here is the break final result');
        console.log(this.ticket);
        this.setTGTurlvalue();
        this.getServiceTicket2();


      }, error => {
        this.clearData();
        console.log(error);
      })
  }


  setTGTurlvalue() {
    console.log("set value TGT URL    :" + this.ticket)
    this.storage.set('tgturl', this.ticket);
  }

  getServiceTicket2() {

    this.storage.get('tgturl').then((val) => {
      this.storeticket = val
    })


    this.ticket = this.storeticket


    var headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });

    this.service = 'service=https://cas.apiit.edu.my/cas/login';




    this.http.post(this.ticket, this.service, options)
      .subscribe(res => {
        this.serviceTicket = res.text()
        this.validateST2();
        console.log("Service Ticket = " + this.serviceTicket);
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
        //this.presentAlertdone();
        this.showHome();
        console.log("this is what we get    :" + this.respond);


      }, error => {

        this.clearData();

        console.log('Error message' + error);
      })
  }


  clearData() {

    this.login();

  }

  login() {
    this.navCtrl.setRoot(LOGINPage);
  }

  showHome() {
    this.navCtrl.setRoot(HOMEPage);
  }
}
