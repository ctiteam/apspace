import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import { CasTicketProvider } from './cas-ticket';

@Injectable()
export class EventsProvider {

  UPCOMINGCLASS_URL = 'http://10.11.25.131/event/upcoming_class';

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
        const url = `${this.UPCOMINGCLASS_URL}?ticket=${st}`;
        return this.http.get(url);
      }),
    );
  }
}
