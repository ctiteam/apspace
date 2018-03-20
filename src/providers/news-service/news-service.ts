import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const NEWSUrl = 'https://webspace.apiit.edu.my/news/rss.xml';

@Injectable()
export class NewsServiceProvider {

  constructor(public http: Http) { }

  getPosts() {
    return this.http.get(NEWSUrl).map(res => res.json())
  }
}
