import { Component } from '@angular/core';
import {
  ActionSheetController, ActionSheetButton, AlertController, IonicPage
} from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize, map, tap } from 'rxjs/operators';

import { Trips } from '../../interfaces';
import { BusTrackingProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-bus-tracking',
  templateUrl: 'bus-tracking.html',
})
export class BusTrackingPage {

  locations: Location[];

  selectedDay: string;
  selectedFrom: string;
  selectedTo: string;

  tripDays: string[];
  tripFrom: string[];
  tripTo: string[];

  trip$: Observable<Trips[]>;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public bus: BusTrackingProvider,
    public alertCtrl: AlertController,
  ) { }

  presentActionSheet() {
    this.actionSheetCtrl.create({
      buttons: this.tripDays.map(day => <ActionSheetButton>{
        text: day,
        handler: () => { this.selectedDay = day; }
      }),
    }).present();
  }

  swapTrip() {
    this.selectedFrom = [this.selectedTo, this.selectedTo = this.selectedFrom][0];
  }

  getTrips(refresher?) {
    this.trip$ = this.bus.getTrips(Boolean(refresher)).pipe(
      map(d => d.trips_times),
      tap(ts => {
        this.selectedDay = (this.tripDays = Array.from(new Set(ts.map(t => t.trip_day))))[0];
        this.tripFrom = Array.from(new Set(ts.map(t => t.trip_from)));
        this.tripTo = Array.from(new Set(ts.map(t => t.trip_to)));
      }),
      finalize(() => refresher && refresher.complete()),
    );
  }

  ionViewDidLoad() {
    this.getTrips();
  }

}
