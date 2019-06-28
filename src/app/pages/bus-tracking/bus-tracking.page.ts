import { Component, OnInit } from '@angular/core';
import { BusTrackingService } from 'src/app/services';
import { Observable } from 'rxjs';
import { Trips } from 'src/app/interfaces';
import { map, finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-bus-tracking',
  templateUrl: './bus-tracking.page.html',
  styleUrls: ['./bus-tracking.page.scss'],
})
export class BusTrackingPage implements OnInit {
  trip$: Observable<Trips[]>;

  constructor(
    public busService: BusTrackingService,
  ) { }

  ngOnInit() {
    this.getTrips();
    this.getLocations();
  }

  getTrips(refresher?) {
    this.busService.getTrips(Boolean(refresher)).pipe(
      map(res => res.trips_times),
      tap(d => console.log(d)),
      finalize(() => refresher && refresher.complete()),
    ).subscribe();
  }

  getLocations(refresher?) {
    this.busService.getLocationDetails().pipe(
      map(res => res.locations),
      tap(d => console.log(d)),
    ).subscribe();
  }

}
