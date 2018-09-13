import { Component } from '@angular/core';
import {
  ActionSheetButton, ActionSheetController, AlertController, IonicPage, ModalController,
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

  detailsJson = [{
    name: 'APU',
    address:
      [{
        firstStreet: 'Jalan Teknologi 5',
        secondStreet: 'Technology Park Malaysia',
        area: 'Bukit Jalil',
        city: '',
        state: '',
        postalCode: '57000',
        contactNumber: '+603 8996 1000',
      }],
    longitude: '',
    latitude: '',
    locationImg: 'assets/img/pickUpLocations/APU.jpg',
  },
  {
    name: 'LRT',
    address:
      [{
        firstStreet: 'Bukit Jalil LRT Station',
        secondStreet: '',
        area: 'Bukit Jalil',
        city: '',
        state: '',
        postalCode: '57000',
        contactNumber: '+603-7885 2585',
      }],
    longitude: '',
    latitude: '',
    locationImg: 'assets/img/pickUpLocations/LRT.jpg',
  },
  {
    name: 'APIIT@TPM',
    address:
      [{
        firstStreet: 'Jalan Innovasi 1',
        secondStreet: 'Technology Park Malaysia',
        area: 'Bukit Jalil',
        city: '',
        state: '',
        postalCode: '57000',
        contactNumber: '+603 8996 1000',
      }],
    longitude: '',
    latitude: '',
    locationImg: 'assets/img/pickUpLocations/APIIT.jpg',
  },
  {
    name: 'SCP',
    address:
      [{
        firstStreet: 'South City Plaza Mall',
        secondStreet: 'Persiaran Serdang Perdana',
        area: 'Taman Serdang Perdana',
        city: 'Seri Kembangan',
        state: 'Selangor',
        postalCode: '43300',
        contactNumber: '+603-8948 1888',
      }],
    longitude: '',
    latitude: '',
    locationImg: 'assets/img/pickUpLocations/SCP.jpg',
  },
  {
    name: 'F.PARK',
    address:
      [{
        firstStreet: 'Fortune Park Apartments',
        secondStreet: 'Persiaran Serdang Perdana',
        area: 'Taman Serdang Perdana',
        city: 'Seri Kembangan',
        state: 'Selangor',
        postalCode: '43300',
        contactNumber: '+6016-910 5905',
      }],
    longitude: '',
    latitude: '',
    locationImg: 'assets/img/pickUpLocations/FP.jpg',
  },
  {
    name: 'ENDAH',
    address:
      [{
        firstStreet: 'Endah Promenade',
        secondStreet: 'Jalan 1/149e',
        area: 'Taman Sri Endah',
        city: '',
        state: 'Kuala Lumper',
        postalCode: '57000',
        contactNumber: '+6013-653 2564',
      }],
    longitude: '',
    latitude: '',
    locationImg: 'assets/img/pickUpLocations/ENDAH.jpg',
  },
  {
    name: 'VISTA',
    address:
      [{
        firstStreet: 'Vista Komanwel',
        secondStreet: 'Jalan Jalil Perkasa 19',
        area: 'Bukit Jalil',
        city: '',
        state: 'Kuala Lumpur',
        postalCode: '57000',
        contactNumber: '+603-2201 1125',
      }],
    longitude: '',
    latitude: '',
    locationImg: 'assets/img/pickUpLocations/VISTA.jpg',
  },
  {
    name: 'MOSQUE',
    address:
      [{
        firstStreet: 'Masjid Sri Petaling - Markaz Tabligh',
        secondStreet: 'Jalan Radin Anum',
        area: 'Sri Petaling',
        city: '',
        state: 'Kuala Lumpur',
        postalCode: '57000',
        contactNumber: '',
      }],
    longitude: '',
    latitude: '',
    locationImg: 'assets/img/pickUpLocations/MOSQUE.jpg',
  }];

  trip$: Observable<Trips[]>;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public bus: BusTrackingProvider,
    public alertCtrl: AlertController,
    private settings: SettingsProvider,
    private modalCtrl: ModalController,
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
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    this.trip$ = this.bus.getTrips(Boolean(refresher)).pipe(
      map(d => d.trips_times),
      tap(ts => {
        this.tripDays = Array.from(new Set(ts.map(t => t.trip_day)));
        this.selectedDay = this.selectedDay || this.tripDays.find(d => d.indexOf(days[new Date().getDay()]) !== -1);
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
    tripDetails = this.detailsJson.find(location => this.selectedFrom === location.name);
    // XXX: Technical debt for transition to Ionic 4 (pass object)
    const busTrackingModal = this.modalCtrl.create('BusTripInfoModalPage', {
      trips,
      tripDetails,
      selectedFrom: this.selectedFrom,
      section,
      nextTrip,
    }, modalOpts);
    busTrackingModal.present();
  }

}
