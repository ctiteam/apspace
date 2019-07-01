import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Trips, BusTrips, Locations } from 'src/app/interfaces';
import { map, tap, publishLast, refCount } from 'rxjs/operators';

@Component({
  selector: 'app-bus-tracking',
  templateUrl: './bus-tracking.page.html',
  styleUrls: ['./bus-tracking.page.scss'],
})
export class BusTrackingPage implements OnInit {
  trip$: Observable<Trips[]>;
  busTrackingUrl = 'https://api.apiit.edu.my/transix';


  constructor(
    public http: HttpClient
  ) { }

  ngOnInit() {
    this.getTrips();
    this.getLocations();
  }

  getTrips() {
    const url = `${this.busTrackingUrl}/trips`;
    return this.http.get<BusTrips>(url).pipe(
      publishLast(),
      refCount(),
      map(res => res.trips_time),
      tap(d => console.log(d)),
    ).subscribe();
  }

  getLocations() {
    const url = `${this.busTrackingUrl}/locations`;
    return this.http.get<Locations>(url).pipe(
      map(res => res.locations),
      tap(d => console.log(d)),
    ).subscribe();
  }

}
