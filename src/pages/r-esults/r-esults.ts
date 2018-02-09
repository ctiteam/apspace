import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
import { ToastController } from 'ionic-angular';


declare var Connection;
@Component({
  selector: 'page-r-esults',
  templateUrl: 'r-esults.html',
  providers: []
})

export class RESULTSPage {

  INTAKES: any;
  intake_url: string;
  results: any;
  intake: string;
  studentNumber: string;
  resultURL: string;
  student_id: string;
  student_intake: string;
  onDevice: boolean;
  offline_intakes: any;

 

  constructor(
    public navCtrl: NavController,
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
    this.network.onConnect().subscribe(data => {
      this.displayNetworkUpdate(data.type)
    }, error => {
      console.log(error);
    })

    this.network.onDisconnect().subscribe(data => {
      this.displayNetworkUpdate(data.type)
    }, error => {
      console.log(error);
    })
  }

  displayNetworkUpdate(connectionState: string){
    let networkType = this.network.type;
    this.toastCtrl.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000
    }).present();
  }
  

  checknetwork() {
    if (this.isOnline()) {
      this.loadIntakes();
    } else {
      this.showToastWithCloseButton();
      this.loadIntakesFromStorage();
    }
  }

  isOnline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  loadIntakes() {
    this.intake_url = "https://ws.apiit.edu.my/web-services/index.php/student/courses";
    let headers = new Headers();
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    this.http.get(this.intake_url, options)
      .subscribe(res => {
        this.INTAKES = res.json();
        this.student_id = this.INTAKES[0].STUDENT_NUMBER
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

  showToastWithCloseButton() {
    const toast = this.toastCtrl.create({
      message: 'Your internet connection appears to be offline. Data integrity is not guaranteed.',
      showCloseButton: true,
      closeButtonText: 'Retry'
    });
    toast.onDidDismiss(this.dismissHandler);
    toast.present();
}
private dismissHandler() {
  console.info('Toast onDidDismiss()');
}

  getItems(type: any) {
    return this.INTAKES[type];
  }
}
