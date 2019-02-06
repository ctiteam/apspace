import { Component } from '@angular/core';
import {
  ActionSheetButton,
  ActionSheetController,
  AlertController,
  IonicPage,
  ModalController,
  MenuController,
} from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize, map, tap, filter } from 'rxjs/operators';

import { Trips, BusTrips, ApuLocations, LocationsInterface } from '../../interfaces';
import { BusTrackingProvider, SettingsProvider } from '../../providers';

import * as _ from "lodash";

@IonicPage()
@Component({
  selector: 'page-bus-tracking',
  templateUrl: 'bus-tracking.html',
})
export class BusTrackingPage {
  objectKeys = Object.keys;
  locations: LocationsInterface[];
  dateNow = new Date();
  // locations: Location[];
  // pickUpLocationDetails: LocationDetails;
  // pickUpLocationDetails: any;

  // selectedDay: string;
  // selectedFrom: string;
  // selectedTo: string;

  // tripDays: string[];
  // tripFrom = {} as Array<{ [name: string]: string }>;
  // tripTo = {} as Array<{ [name: string]: string}>;

  numOfSkeletons = new Array(6);

  trip$: Observable<Trips[]>;
  location$: Observable<LocationsInterface[]>;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public bus: BusTrackingProvider,
    public alertCtrl: AlertController,
    private settings: SettingsProvider,
    private modalCtrl: ModalController,
    private busProv: BusTrackingProvider,
    public menu: MenuController
  ) {
  }

  
  openFilterMenu() {
    this.menu.toggle();
}

  /** Display trip days. */
  // presentActionSheet() {
  //   this.actionSheetCtrl
  //     .create({
  //       buttons: this.tripDays.map(day => ({
  //         text: day.toUpperCase(),
  //         handler: () => { this.selectedDay = day; },
  //       })),
  //     })
  //     .present();
  // }

  /** Swap selectedFrom and selectedTo value. */
  // swapTrip() {
  //   this.selectedFrom = [
  //     this.selectedTo,
  //     (this.selectedTo = this.selectedFrom),
  //   ][0];
  // }

  /** Get bus tracking trips and set the first day. */
  getTrips(refresher?) {
    this.trip$ = this.bus.getTrips(Boolean(refresher))
    .pipe(
      map((response) => { //group items by trip_from
      return _.mapValues(
          _.groupBy(response.trips, item => {
            return item.trip_from;
          })
        );
      }),
      map((filteredTrips) => { // group items by trip_to
        return _.forEach(filteredTrips, function(value, key) {
              filteredTrips[key] = _.groupBy(filteredTrips[key], function(item) {
                return item.trip_to;
              });
            });
        }
      ),
      map((t) => {
        console.log(t);
        return t;
      }),
      finalize(() => refresher && refresher.complete())
    );
    // const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    // this.trip$ = this.bus.getTrips(Boolean(refresher)).pipe(
    //   map(d => d.trips),
    //   tap(ts => {
    //     this.tripDays = Array.from(new Set(ts.map(t => t.trip_day)));
    //     this.selectedDay =
    //       this.selectedDay ||
    //       this.tripDays.find(d => d.indexOf(days[new Date().getDay()]) !== -1);
    //     this.tripFrom = {} as Array<{ [name: string]: string }>;
    //     this.tripTo = {} as Array<{ [name: string]: string }>;
    //     // unique set of object
    //     ts.forEach(t => {
    //       this.tripFrom[t.trip_from] = t.trip_from_display_name;
    //       this.tripTo[t.trip_to] = t.trip_to_display_name;
    //     });
    //     this.selectedFrom = this.settings.get('tripFrom') || 'Any';
    //     this.selectedTo = this.settings.get('tripTo') || 'Any';
    //   }),
    //   finalize(() => refresher && refresher.complete()),
    // );
  }

  getLocations(refresher?){
    this.bus.getLocationDetails(Boolean(refresher))
    .subscribe(
      (response) => {
        this.locations = response.locations;
      }
    );
  }

  getLocationDisplayName(locationName: string){
    for (let location of this.locations){
      if(location.location_name == locationName){
        return location.location_nice_name;
      }
    }
  }

  getLocationColor(locationName: string){
    for (let location of this.locations){
      if(location.location_name == locationName){
        return location.location_color;
      }
    }
  }

  strToTime(strTime: string){
    let customDate = new Date();
    customDate.setHours(+strTime.split(":")[0]);
    customDate.setMinutes(+strTime.split(":")[1]);    
    return customDate;
  }

  ionViewDidLoad() {
    this.getTrips();
    this.getLocations(); 
  }

  ionViewDidLeave() {
    // this.settings.set('tripFrom', this.selectedFrom);
    // this.settings.set('tripTo', this.selectedTo);
  }

  // presentMoreInfoModal(trips: Trips[], nextTrip: string, section?) {
  //   let tripDetails: any;
  //   const modalOpts = {
  //     showBackdrop: true,
  //     enableBackdropDismiss: true,
  //     cssClass: 'busTrackingModal',
  //   };

  //   this.busProv.getLocationDetails().subscribe(
  //     data => (this.pickUpLocationDetails = data),
  //     error => console.log('Error:', error),
  //     () => {
  //       tripDetails = this.pickUpLocationDetails.locations.find(
  //         location => this.selectedFrom === location.location_nice_name,
  //       );
  //       const busTrackingModal = this.modalCtrl.create(
  //         'BusTripInfoModalPage',
  //         {
  //           trips,
  //           tripDetails,
  //           selectedFrom: this.selectedFrom,
  //           section,
  //           nextTrip,
  //         },
  //         modalOpts,
  //       );
  //       busTrackingModal.present();
  //     },
  //   );
  //   // XXX: Technical debt for transition to Ionic 4 (pass object)
  // }
}
