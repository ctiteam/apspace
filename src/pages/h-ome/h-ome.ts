import { Component, NgModule } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewsService } from '../../app/services/news.service';
import { BrowserModule } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-h-ome',
  templateUrl: 'h-ome.html'
})
export class HOMEPage {
  name: string;
  content: any[] = new Array();
  counter: number;

  items = [];
  getNews: any;

  constructor(public navCtrl: NavController, private newsService: NewsService, private storage: Storage) {
    this.getPosts();
    this.getvalue();
  }

  getPosts() {
    this.newsService.getPosts().subscribe(response => {
      this.items = response;
      console.log(this.items);
      this.setvalue()
    });
  }

  setvalue() {
    console.log("set value respond:" + this.items)
    this.storage.set('news', this.items);
  }

  getvalue() {
    this.storage.get('news').then((val) => {
      this.getNews = val;
      console.log("GET VALUE   :" + this.getNews)
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 1500);
    this.getPosts();
  }
}
