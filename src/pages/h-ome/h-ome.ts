import { Component, NgModule } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewsService } from '../../app/services/news.service';
import { BrowserModule } from '@angular/platform-browser';


@Component({
  selector: 'page-h-ome',
  templateUrl: 'h-ome.html'
})
export class HOMEPage {
  name: string;
  content: any[] = new Array();
  counter: number;

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  items = [];

  constructor(public navCtrl: NavController, private newsService: NewsService) {
    this.counter = 0;
    this.getData();
    this.name = 'Angular2'
  }

  ngOnInit() {
    this.getPosts();
  }

  getPosts() {
    this.newsService.getPosts().subscribe(response => {
      this.items = response;
      console.log(this.items);
    });
  }


  getData() {
    console.log(this.counter + 'dat size' + this.items.length);

    for (let i = this.counter + 1; i < this.items.length; i++) {
      this.content.push(this.items[i]);
      if (i % 10 == 0) break;
    }
    this.counter += 10;
  }



}
