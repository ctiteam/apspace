import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { publishLast, refCount } from 'rxjs/operators';

import { BusTrips } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class BusTrackingService {
  busTrackingUrl = 'https://api.apiit.edu.my/transix';
  url = `${this.busTrackingUrl}/locations`;

  constructor(public http: HttpClient) { }

  /**
   * GET: Request bus trips
   *
   * @param refresh - force refresh (default: false)
   */
  getTrips(refresh?: boolean): Observable<BusTrips> {
    const url = `${this.busTrackingUrl}/trips`;
    return this.http.get<BusTrips>(url).pipe(
      publishLast(),
      refCount(),
    );
  }

  getLocationDetails() {
    const url = `${this.busTrackingUrl}/locations`;
    return this.http.get(url);
  }
}
