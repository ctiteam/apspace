import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { publishLast, refCount } from 'rxjs/operators';

import { News } from '../interfaces';

@Injectable()
export class NewsProvider {

  newsUrl = 'https://webspace.apiit.edu.my/news/rss.xml';  // json output

  constructor(public http: HttpClient) { }

  /**
   * GET: Request news feed
   *
   * @param refresh - force refresh (default: false)
   */
  get(refresh?: boolean): Observable<News[]> {
    const options = refresh ? { headers: { 'x-refresh': '' } } : {};
    return this.http.get<News[]>(this.newsUrl, options).pipe(publishLast(), refCount());
  }

}
