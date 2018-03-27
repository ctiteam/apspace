import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { News } from '../../interfaces';

@Injectable()
export class NewsProvider {

  newsUrl = 'https://webspace.apiit.edu.my/news/rss.xml';  // json output

  constructor(public http: HttpClient) { }

  get(): Observable<News[]> {
    return this.http.get<News[]>(this.newsUrl).publishLast().refCount();
  }

}
