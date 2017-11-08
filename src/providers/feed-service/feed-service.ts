import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
//import { Observable } from 'rxjs/Observable';

export class FeedItem{
  description: string;
  link: string;
  title: string;

  constructor(description: string, link: string, title: string){
    this.description = description;
    this.link = link;
    this.title = title;
  }

  
}
export class Feed{
  
  link: string;
  title: string;

  constructor(link: string, title: string){
    this.link = link;
    this.title = title;
  }
}


@Injectable()
export class FeedServiceProvider {

  constructor(public http: Http, public storage: Storage) {
    console.log('Hello FeedServiceProvider Provider');
  }

  public getSavedFeeds(){
    return this.storage.get('savedFeeds').then(data =>{
      let objFromString = JSON.parse(data);
      if(data !== null && data !== undefined){
        return objFromString;
      }else{
        return [];
      }
    });
  }

  public addFeed(newFeed: Feed){

  }

  public getArticleForUrl(feedUrl: string){

  }

}
