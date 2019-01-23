import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { publishLast, refCount, switchMap } from 'rxjs/operators';

import { Timetable } from '../interfaces';

@Injectable()
export class TimetableProvider {

  timetableUrl = 'https://s3-ap-southeast-1.amazonaws.com/open-ws/weektimetable';

  constructor(public http: HttpClient) { }

  /**
   * GET: Request timetable.
   *
   * Use cache by default, force refresh if outdated, multicast (shares)
   * original Observable.
   *
   * @param refresh force refresh (default: false)
   */
  get(refresh?: boolean): Observable<Timetable[]> {
    return this.request(refresh).pipe(publishLast(), refCount());
  }

  /**
   * GET: Internal timetable request without multicast.
   *
   * @param refresh force refresh (default: false)
   */
  private request(refresh?: boolean): Observable<Timetable[]> {
    const options = refresh ? { headers: { 'x-refresh': '' } } : {};
    return this.http.get<Timetable[]>(this.timetableUrl, options).pipe(
      switchMap(tt => !refresh && this.outdated(tt) ? this.request(true) : of(tt)),
    );
  }

  /**
   * Check if the timetable is outdated, if any classes is older than current week.
   *
   * @param tt array of student timetable
   */
  private outdated(tt: Timetable[]): boolean {
    const date = new Date(); // first day of week (Sunday)
    date.setDate(date.getDate() - date.getDay());
    return tt.some(t => new Date(t.DATESTAMP_ISO) < date);
  }

}
