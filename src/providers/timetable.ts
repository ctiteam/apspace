import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { publishLast, refCount } from 'rxjs/operators';

import { Timetable } from '../interfaces';

@Injectable()
export class TimetableProvider {

  newsUrl = 'https://s3-ap-southeast-1.amazonaws.com/open-ws/weektimetable';

  constructor(public http: HttpClient) { }

  /**
   * GET: Request news feed
   *
   * @param refresh - force refresh (default: false)
   */
  get(refresh?: boolean): Observable<Timetable[]> {
    const options = refresh ? { headers: { 'x-refresh': '' } } : {};
    return this.http.get<Timetable[]>(this.newsUrl, options).pipe(publishLast(), refCount());
  }

}
