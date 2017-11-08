import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewsService } from '../../app/services/news.service';

@Component({
  selector: 'page-h-ome',
  templateUrl: 'h-ome.html'
})
export class HOMEPage {

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  items: any; 

  constructor(public navCtrl: NavController, private newsService: NewsService) {

  }

  ngOnInit(){
    this.getPosts();
  }

  getPosts(){
    this.newsService.getPosts().subscribe(response => {
      this.items = response;

      
      
    });
  }


  
}
