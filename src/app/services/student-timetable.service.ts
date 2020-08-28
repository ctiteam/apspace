import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { publishLast, refCount, switchMap } from 'rxjs/operators';

import { StudentTimetable } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class StudentTimetableService {

  readonly timetableUrl = 'https://s3-ap-southeast-1.amazonaws.com/open-ws/weektimetable';

  constructor(public http: HttpClient) { }

  /**
   * GET: Request timetable.
   *
   * Use cache by default, force refresh if outdated, multicast (shares)
   * original Observable.
   *
   * @param refresh force refresh (default: false)
   */
  get(refresh?: boolean): Observable<StudentTimetable[]> {
    return this.request(Boolean(refresh)).pipe(publishLast(), refCount());
  }

  /**
   * GET: Internal timetable request without multicast.
   *
   * @param refresh force refresh (default: false)
   */
  private request(refresh: boolean): Observable<StudentTimetable[]> {
    const options = refresh ? { headers: { 'x-refresh': '' } } : {};
    return this.http.get<StudentTimetable[]>(this.timetableUrl, options).pipe(
      switchMap(tt => !refresh && this.outdated(tt) ? this.request(true) : of(tt)),
    );
  }

  /**
   * Check if the timetable is outdated, if any classes is older than current week.
   *
   * @param tt array of student timetable
   */
  private outdated(tt: StudentTimetable[]): boolean {
    const date = new Date(); // first day of week (Sunday)
    date.setDate(date.getDate() - date.getDay());
    const dates = Array.from(new Set(tt.map(t => t.DATESTAMP_ISO)));
    return dates.length === 0 || dates.some(d => new Date(d) < date);
  }

}
