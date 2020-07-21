import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { publishLast, refCount, tap } from 'rxjs/operators';

import { IntakeListing } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class IntakeListingService {

  intakesUrl = 'https://s3-ap-southeast-1.amazonaws.com/open-ws/intake_listing';

  constructor(
    public http: HttpClient,
    private network: Network,
    private storage: Storage
  ) { }

  /**
   * GET: Request intakes.
   *
   * Use cache by default, force refresh if outdated, multicast (shares)
   * original Observable.
   *
   * @param refresh force refresh (default: false)
   */
  get(refresh?: boolean): Observable<IntakeListing[]> {
    if (this.network.type !== 'none') {
      const options = refresh ? { headers: { 'x-refresh': '' } } : {};
      return this.http.get<IntakeListing[]>(this.intakesUrl, options).pipe(
        tap(intakeList => refresh && this.storage.set('intakeList-cache', intakeList)),
        publishLast(), refCount());
    } else {
      return from(this.storage.get('intakeList-cache'));
    }
  }
}
