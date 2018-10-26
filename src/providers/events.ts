import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import { Role } from '../interfaces';
import { SettingsProvider } from '../providers';
import { CasTicketProvider } from './cas-ticket';

@Injectable()
export class EventsProvider {

  UPCOMINGCLASS_URL = 'http://10.11.25.131/event/upcoming_class';
  HOLIDAYS_URL = 'https://api.apiit.edu.my/transix/holidays';

  constructor(
    public http: HttpClient,
    public cas: CasTicketProvider,
    public settings: SettingsProvider,
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
    const role = this.settings.get('role') & Role.Student ? '/filtered/students' : '/filtered/staff';
    return this.cas.getST(this.HOLIDAYS_URL).pipe(
      switchMap(st => {
        const options = {
          headers: { 'Content-type': 'application/json' },
        };
        const url = `${this.HOLIDAYS_URL}${role}?ticket=${st}`;
        return this.http.get(url, options);
      }),
    );
  }
}
