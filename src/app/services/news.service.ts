import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { publishLast, refCount, tap } from 'rxjs/operators';

import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { News } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  // this service needs to be refactored and changed to webspace items service
  newsUrl = 'https://api.apiit.edu.my/webspace/news';  // json output
  slideshowUrl = 'https://api.apiit.edu.my/webspace/slideshow';  // json output

  constructor(public http: HttpClient, private network: Network, private storage: Storage) { }

  /**
   * GET: Request news feed
   *
   * @param refresh - force refresh (default: false)
   */
  get(refresh?: boolean): Observable<News[]> {
    if (this.network.type !== 'none') {
      if (refresh) { // get from backend
        const header = new HttpHeaders({ 'x-refresh': '' });
        return this.http.get<News[]>(this.newsUrl, { headers: header }).pipe(
          tap(news => refresh && this.storage.set('news-cache', news)),
          publishLast(), refCount());
      } else { // get from local storage
        return from(this.storage.get('news-cache'));
      }
    } else {
      return from(this.storage.get('news-cache'));
    }
  }

  /**
   * GET: Request slideshow items
   *
   * @param refresh - force refresh (default: false)
   */
  getSlideshow(refresh?: boolean): Observable<any[]> {
    if (this.network.type !== 'none') {
      if (refresh) {
        const header = new HttpHeaders({ 'x-refresh': '' });
        return this.http.get<any[]>(this.slideshowUrl, { headers: header }).pipe(
          tap(slideshowItems => refresh && this.storage.set('slideshow-cache', slideshowItems)),
          publishLast(), refCount());
      } else {
        return from(this.storage.get('slideshow-cache'));

      }
    } else {
      return from(this.storage.get('slideshow-cache'));
    }
  }

}
