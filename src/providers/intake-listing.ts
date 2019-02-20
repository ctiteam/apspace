import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { publishLast, refCount } from 'rxjs/operators';

import { IntakeListing } from '../interfaces';

@Injectable()
export class IntakeListingProvider {

  intakesUrl = 'https://s3-ap-southeast-1.amazonaws.com/open-ws/intake_listing';

  constructor(public http: HttpClient) { }

  /**
   * GET: Request intakes.
   *
   * Use cache by default, force refresh if outdated, multicast (shares)
   * original Observable.
   *
   * @param refresh force refresh (default: false)
   */
  get(refresh?: boolean): Observable<IntakeListing[]> {
    const options = refresh ? { headers: { 'x-refresh': '' } } : {};
    return this.http.get<IntakeListing[]>(this.intakesUrl, options).pipe(publishLast(), refCount());
  }

}
