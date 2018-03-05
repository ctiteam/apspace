import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
import { ToastController, Toast } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { LoadingController } from 'ionic-angular';


declare var Connection;

const intake_url = "https://ws.apiit.edu.my/web-services/index.php/student/courses";

@Component({
  selector: 'page-r-esults',
  templateUrl: 'r-esults.html',
  providers: []
})

export class RESULTSPage {

  INTAKES: any;
  results: any;
  intake: string;
  studentNumber: string;
  resultURL: string;
  student_id: string;
  student_intake: string;
  onDevice: boolean;
  offline_intakes: any;


  connected: Subscription;
  disconnected: Subscription;

  activeSeg: any;


  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public http: Http,
    public storage: Storage,
    private network: Network,
    public platform: Platform,
    private toastCtrl: ToastController) {
    this.onDevice = this.platform.is('cordova');
  }

  ionViewDidLoad() {
    this.checknetwork(); //checking network
  }

  ionViewDidEnter() {
    this.connected = this.network.onConnect().subscribe(data => {
      document.getElementById("offline_indicator").innerHTML = '';
      this.displayNetworkUpdateOnline(data.type)
      this.presentLoading();
    }, error => {
      console.log(error);
    })

   this.disconnected = this.network.onDisconnect().subscribe(data => {
    document.getElementById("offline_indicator").innerHTML = 'OFFLINE';
      this.displayNetworkUpdateOffline(data.type)
    }, error => {
      console.log(error);
    })
  }

  ionViewWillLeave(){
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }
  
  

  displayNetworkUpdateOnline(connectionState: string) {
    let networkType = this.network.type;
    const toast_online = this.toastCtrl.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000,
    });
    toast_online.present();
  }


  displayNetworkUpdateOffline(connectionState: string) {
    const toast_offline = this.toastCtrl.create({
      message: `You are now ${connectionState} `,
      duration: 3000,
      position: 'bottom'
    });
    toast_offline.present();
  }



  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'You are now offline',
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }


  checknetwork() {
    if (this.isOnline()) {
      this.loadIntakes();
    } else {
      this.presentToast();
      this.loadIntakesFromStorage();
      document.getElementById("offline_indicator").innerHTML = 'OFFLINE';
    }
  }

  isOnline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 2000
    });
    loader.present();
  }

  loadIntakes() {
    let headers = new Headers();
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    this.http.get(intake_url, options)
      .subscribe(res => {
        this.INTAKES = res.json();
        this.activeSeg = this.INTAKES[0].INTAKE_CODE;
        this.student_id = this.INTAKES[0].STUDENT_NUMBER;
        this.storage.set('intakes', this.INTAKES);
        this.loadResults(this.student_id, this.INTAKES[0].INTAKE_CODE);
      }, error => {
        console.log(error);
      })
  }


  loadResults(st_id, intake_code) {
    this.resultURL = "https://ws.apiit.edu.my/web-services/index.php/student/subcourses?format=json&id=" + st_id + '&intake=' + intake_code;
    var headers = new Headers();
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    this.http.get(this.resultURL, options)
      .subscribe(ress => {
        this.results = ress.json();
        this.activeSeg = intake_code;
        this.storage.set('results', this.results);
      }, error => {
        console.log(error);
      })
  }

  loadIntakesFromStorage() {
    this.storage.get('intakes').then((val) => {
      this.INTAKES = val;
      this.loadResultsFromStorage();
      console.log(this.INTAKES);
    });
  }

  loadResultsFromStorage() {
    this.storage.get('results').then((val) => {
      this.results = val;
      console.log(this.results);
    });
  }

  doRefresh(refresher) {
    this.checknetwork();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
}
