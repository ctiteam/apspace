import { Component } from '@angular/core';
import { Platform, Events, MenuController, NavController, LoadingController,
  ToastController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';

import { NewsProvider } from '../../providers/';

declare var Connection;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  name: string;
  content: any[] = new Array();
  onDevice: boolean;
  items = [];       //All the news posts are inside items
  getNews = [];     //News from local storage
  itemDetail = {}
  connected: Subscription;
  disconnected: Subscription;

  exit = false;
  back = null;

  constructor(
    public events: Events,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public network: Network,
    public platform: Platform,
    private news: NewsProvider,
    private storage: Storage,
    private toastCtrl: ToastController,
  ) {
    this.onDevice = this.platform.is('cordova');

    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        // TODO: fix this event
        this.events.subscribe('user:logout', _ => this.back && this.back());
        this.back = this.platform.registerBackButtonAction(() => {
          if (this.menuCtrl.isOpen()) {
            this.menuCtrl.close();
          } else if (this.navCtrl.canGoBack()) {
            this.navCtrl.pop();
          } else if (this.exit) {
            this.platform.exitApp();
          } else {
            let toast = this.toastCtrl.create({
              message: 'Tap again to exit.',
              duration: 2000,
            });
            this.exit = true;
            toast.onDidDismiss(() => this.exit = false);
            toast.present();
          }
        });
      }
    });
  }

  ionViewDidLoad() {
    this.getPosts();
  }

  checknetwork() {
    if (this.isOnline()) {
      this.getPosts();
    } else {
      this.loadPosts();
      this.presentToast();
      document.getElementById("offline_indicator").innerHTML = 'OFFLINE'
     ;

    }
  }

  isOnline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
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

  ionViewDidLeave() {
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


  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait, establishing the connection",
      duration: 1500
    });
    loader.present();
  }


  //Loads news from Web Service
  getPosts() {
    this.news.get().subscribe(response => {
      this.items = response;
      this.storage.set('news', this.items);
    });
  }

  //Loads saved news from Local Storage
  loadPosts() {
    document.getElementById("offline_indicator").innerHTML = 'OFFLINE'
    this.storage.get('news').then((val) => {
      this.items = val;
    });
  }

  //Pull to Refresh function
  doRefresh(refresher) {
    setTimeout(() => {
      this.checknetwork();
      refresher.complete();
    }, 1500);

  }

  openBasicModal(item) {
    this.navCtrl.push('HomeModalPage', {
      itemDetail: item
    });
  }
}
