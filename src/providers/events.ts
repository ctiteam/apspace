import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import { CasTicketProvider } from './cas-ticket';

@Injectable()
export class EventsProvider {

  UPCOMINGCLASS_URL = 'http://10.11.25.131/events/upcoming_class';
  HOLIDAYS_URL = 'http://10.11.25.131/events/holidays';

  constructor(
    public http: HttpClient,
    public cas: CasTicketProvider,
  ) { }

  /**
   * GET: Get the student's upcoming class
   *
   */
  getUpcomingClass(): Observable<any> {
    return this.cas.getST(this.UPCOMINGCLASS_URL).pipe(
      switchMap(st => {
        const options = {
          headers: { 'Content-type': 'application/json' },
        };
        const url = `${this.UPCOMINGCLASS_URL}?ticket=${st}`;
        return this.http.get(url, options);
      }),
    );
  }

  /**
   * GET: Get the list of holidays
   *
   */
  getHolidays(): Observable<any> {
    return this.cas.getST(this.HOLIDAYS_URL).pipe(
      switchMap(st => {
        const options = {
          headers: { 'Content-type': 'application/json' },
        };
        const url = `${this.HOLIDAYS_URL}?ticket=${st}`;
        return this.http.get(url, options);
      }),
    );
  }
}
