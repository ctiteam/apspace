import { Component, NgModule } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewsService } from '../../app/services/news.service';
import { BrowserModule } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
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
  getNews: any;     //Local News

  constructor(public navCtrl: NavController, private newsService: NewsService, private storage: Storage, private network: Network) {
    this.getPosts();
    this.networkConnection();
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
  }

  //Loads the saved news from Local Storage
  loadPosts() {
    this.storage.get('news').then((val) => {
      this.getNews = val;
    });
  }

  //Pull to Refresh function
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 1500);
    this.getPosts();
  }


  //Check whether the Network Connection is off/on
  networkConnection() {
    // watch network for a disconnect
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected!');
    });

    // stop disconnect watch
    //disconnectSubscription.unsubscribe();



    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');

      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });

    // stop connect watch
    //connectSubscription.unsubscribe();
  }
}
