import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewsService } from '../../app/services/news.service';
import { BrowserModule } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
import { MyApp } from '../../app/app.component';


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
  getNews= [];     //News from local storage

  connected: Subscription;
  disconnected: Subscription;

  constructor(public platform: Platform, public network: Network, private toast: ToastController,public navCtrl: NavController, private newsService: NewsService, private storage: Storage){
    this.onDevice = this.platform.is('cordova');
  }

  ionViewDidLoad() {
    this.getPosts();
  }

  checknetwork(){
    if(this.isOnline()){

    }else{

    }
  }

  isOnline(): boolean {
    if(this.onDevice && this.network.type){
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine; 
    }
  }

 
  // displayNetworkUpdate(connectionState: string) {
  //   let networkType = this.network.type;
  //   this.toast.create({
  //     message: `You are now ${connectionState} via ${networkType}`,
  //     duration: 3000
  //   }).present();
  // }




  //Loads news from Web Service
  getPosts() {
    this.newsService.getPosts().subscribe(response => {
      this.items = response;
      
       this.savePosts()
    });
  }

  //Saves news to Local Storage
  savePosts() {
    this.storage.set('news', this.items);
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
}
