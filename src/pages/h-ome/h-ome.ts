import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewsService } from '../../app/services/news.service';
import { BrowserModule } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';


@Component({
  selector: 'page-h-ome',
  templateUrl: 'h-ome.html'
})
export class HOMEPage {
  name: string;
  content: any[] = new Array();
  counter: number;

  items = [];       //All the news posts inside items
  getNews= [];     //Local News


  connected: Subscription;
  disconnected: Subscription;

  constructor(public network: Network, private toast: ToastController,public navCtrl: NavController, private newsService: NewsService, private storage: Storage){
  }

  ionViewDidLoad() {
    this.getPosts();
  }

  networkConnection() {
    this.connected = this.network.onConnect().subscribe(data => {
      this.getPosts();
      this.displayNetworkUpdate(data.type);
      console.log(data)
    }, error => console.error(error));


    this.disconnected = this.network.onDisconnect().subscribe(data => {
      this.loadPosts();
      this.displayNetworkUpdate(data.type);
       
      console.log(data)
    }, error => console.error(error));

    // stop connect watch
    //connectSubscription.unsubscribe()
  }

  displayNetworkUpdate(connectionState: string) {
    let networkType = this.network.type;
    this.toast.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000
    }).present();
  }

  //Loads the news from Web Service
  getPosts() {
    this.newsService.getPosts().subscribe(response => {
      this.items = response;
       this.savePosts()
    });
  }

  //Saves the news to Local Storage
  savePosts() {
    this.storage.set('news', this.items);
    console.log("News are saved locally: " + this.items);
  }

  //Loads the saved news from Local Storage
  loadPosts() {
    this.storage.get('news').then((val) => {
      this.items = val;
      console.log(this.items)
    });
  }

  //Pull to Refresh function
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      console.log('Async operation has ended');
      this.getPosts();
      refresher.complete();
      
    }, 1500);
    
  }
}
