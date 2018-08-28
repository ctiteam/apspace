import { Component } from '@angular/core';
import {
  ActionSheetButton, ActionSheetController, AlertController, IonicPage,
} from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize, map, tap } from 'rxjs/operators';

import { Trips } from '../../interfaces';
import { BusTrackingProvider, SettingsProvider } from '../../providers';

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
    private settings: SettingsProvider,
  ) { }

  /** Display trip days. */
  presentActionSheet() {
    this.actionSheetCtrl.create({
      buttons: this.tripDays.map(day => {
        return {
          text: day.toUpperCase(),
          handler: () => { this.selectedDay = day; },
        } as ActionSheetButton;
      }),
    }).present();
  }

  /** Swap selectedFrom and selectedTo value. */
  swapTrip() {
    this.selectedFrom = [this.selectedTo, this.selectedTo = this.selectedFrom][0];
  }

  /** Get bus tracking trips and set the first day. */
  getTrips(refresher?) {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    this.trip$ = this.bus.getTrips(Boolean(refresher)).pipe(
      map(d => d.trips_times),
      tap(ts => {
        this.tripDays = Array.from(new Set(ts.map(t => t.trip_day)));
        this.selectedDay = this.selectedDay || this.tripDays.find(d => d.indexOf(days[new Date().getDay()]) !== -1);
        this.tripFrom = Array.from(new Set(ts.map(t => t.trip_from)));
        this.tripTo = Array.from(new Set(ts.map(t => t.trip_to)));
        this.selectedFrom = this.settings.get('tripFrom');
        this.selectedTo = this.settings.get('tripTo');
      }),
      finalize(() => refresher && refresher.complete()),
    );
  }

  ionViewDidLoad() {
    this.getTrips();
  }

  ionViewDidLeave() {
    this.settings.set('tripFrom', this.selectedFrom);
    this.settings.set('tripTo', this.selectedTo);
  }

}
