import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { NewsService } from '../../app/services/news.service';
import { BrowserModule } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { HomeModalPage } from '../home-modal/home-modal';






declare var Connection;
@Component({
  selector: 'page-h-ome',
  templateUrl: 'h-ome.html'
})
export class HOMEPage {
  
  name: string;
  content: any[] = new Array();
  counter: number;
  onDevice: boolean;

  items = [];       //All the news posts are inside items
  getNews = [];     //News from local storage
  itemDetail = {}
  connected: Subscription;
  disconnected: Subscription;

  constructor(private modalCtrl: ModalController, public loadingCtrl: LoadingController, public platform: Platform, public network: Network, private toastCtrl: ToastController, public navCtrl: NavController, private newsService: NewsService, private storage: Storage) {
    this.onDevice = this.platform.is('cordova');
  }

  ionViewDidLoad() {
    this.checknetwork();
  }

  checknetwork() {
    if (this.isOnline()) {
      this.getPosts();
    } else {
      this.loadPosts();
      this.showToastWithCloseButton();

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
      this.displayNetworkUpdateOnline(data.type)
      this.presentLoading();
      this.getPosts();
    }, error => {
      console.log(error);
    })

    this.disconnected = this.network.onDisconnect().subscribe(data => {
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
    const toast_online =  this.toastCtrl.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000,
    }); 
    toast_online.present();
  }


  displayNetworkUpdateOffline(connectionState: string) {
    const toast_offline =  this.toastCtrl.create({
      message: `You are now ${connectionState} `,
      showCloseButton: true,
      closeButtonText: 'TRY AGAIN'
    });
    toast_offline.onDidDismiss(this.dismissHandler)
    toast_offline.present();
  }

  showToastWithCloseButton() {
    let newtworkType1 = this.network.type;
    const toast = this.toastCtrl.create({
      message: 'You are now offline',
      showCloseButton: true,
      closeButtonText: 'TRY AGAIN'
    });
    toast.onDidDismiss(this.dismissHandler);
    toast.present();
  }

  private dismissHandler() {

    console.info('Toast onDidDismiss()');
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
    this.newsService.getPosts().subscribe(response => {
      this.items = response;

      this.savePosts(this.items)

    });
  }

  //Saves news to Local Storage
  savePosts(post: any) {
    this.storage.set('news', post);
  }

  //Loads saved news from Local Storage
  loadPosts() {
    this.storage.get('news').then((val) => {
      this.items = val;
    });
  }

  //Pull to Refresh function
  doRefresh(refresher) {
    setTimeout(() => {
      this.getPosts();
      refresher.complete();
    }, 1500);

  }

  openBasicModal(item){
   this.navCtrl.push( HomeModalPage,{
      itemDetail : item
    });
  }
}
