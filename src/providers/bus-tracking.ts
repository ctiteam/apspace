import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { publishLast, refCount } from 'rxjs/operators';

import { ApuLocations, BusTrips } from '../interfaces';

@Injectable()
export class BusTrackingProvider {
  busTrackingUrl = 'https://api.apiit.edu.my/transix';

  constructor(public http: HttpClient) {}

  /**
   * GET: Request bus trips
   *
   * @param refresh - force refresh (default: false)
   */
  getTrips(refresh?: boolean): Observable<BusTrips> {
    const url = `${this.busTrackingUrl}/trips/applicable`;
    return this.http.get<BusTrips>(url).pipe(
      publishLast(),
      refCount(),
    );
  }

  getLocationDetails(refresh?: boolean): Observable<ApuLocations> {
    const url = `${this.busTrackingUrl}/locations`;
    return this.http.get<ApuLocations>(url).pipe(
      publishLast(),
      refCount(),
    );
  }
}
