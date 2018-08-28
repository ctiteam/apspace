import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { publishLast, refCount } from 'rxjs/operators';

import { OperationHours } from '../interfaces';

@Injectable()
export class OperationHoursProvider {

  operationHourUrl = 'https://webspace.apiit.edu.my/timing/';

  constructor(public http: HttpClient) { }

  /**
   * GET: Request operation hours
   *
   * @param endpoint - <operationHourUrl>/<service>/rss.xml
   * @param refresh - force refresh (default: false)
   */
  get(endpoint: string, refresh?: boolean): Observable<OperationHours[]> {
    const url = this.operationHourUrl + endpoint + '/rss.xml';
    const options = refresh ? { headers: { 'x-refresh': '' } } : {};
    return this.http.get<OperationHours[]>(url, options).pipe(publishLast(), refCount());
  }

}
