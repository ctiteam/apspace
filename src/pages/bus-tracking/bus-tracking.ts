import { Component } from '@angular/core';
import {
  ActionSheetButton,
  ActionSheetController,
  AlertController,
  IonicPage,
  ModalController,
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
  // pickUpLocationDetails: LocationDetails;
  pickUpLocationDetails: any;

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
    private modalCtrl: ModalController,
    private busProv: BusTrackingProvider,
  ) {}

  /** Display trip days. */
  presentActionSheet() {
    this.actionSheetCtrl
      .create({
        buttons: this.tripDays.map(day => ({
          text: day.toUpperCase(),
          handler: () => { this.selectedDay = day; },
        })),
      })
      .present();
  }

  /** Swap selectedFrom and selectedTo value. */
  swapTrip() {
    this.selectedFrom = [
      this.selectedTo,
      (this.selectedTo = this.selectedFrom),
    ][0];
  }

  /** Get bus tracking trips and set the first day. */
  getTrips(refresher?) {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    this.trip$ = this.bus.getTrips(Boolean(refresher)).pipe(
      map(d => d.applicable_trips),
      tap(ts => {
        this.tripDays = Array.from(new Set(ts.map(t => t.trip_day)));
        this.selectedDay =
          this.selectedDay ||
          this.tripDays.find(d => d.indexOf(days[new Date().getDay()]) !== -1);
        this.tripFrom = Array.from(new Set(ts.map(t => t.trip_from)));
        this.tripTo = Array.from(new Set(ts.map(t => t.trip_to)));
        this.selectedFrom = this.settings.get('tripFrom') || 'Any';
        this.selectedTo = this.settings.get('tripTo') || 'Any';
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

  presentMoreInfoModal(trips: Trips[], nextTrip: string, section?) {
    let tripDetails: any;
    const modalOpts = {
      showBackdrop: true,
      enableBackdropDismiss: true,
      cssClass: 'busTrackingModal',
    };

    this.busProv.getLocationDetails().subscribe(
      data => (this.pickUpLocationDetails = data),
      error => console.log('Error:', error),
      () => {
        tripDetails = this.pickUpLocationDetails.locations.find(
          location => this.selectedFrom === location.location_nice_name,
        );
        const busTrackingModal = this.modalCtrl.create(
          'BusTripInfoModalPage',
          {
            trips,
            tripDetails,
            selectedFrom: this.selectedFrom,
            section,
            nextTrip,
          },
          modalOpts,
        );
        busTrackingModal.present();
      },
    );
    // XXX: Technical debt for transition to Ionic 4 (pass object)
  }
}
