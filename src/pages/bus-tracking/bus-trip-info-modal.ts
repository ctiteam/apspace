import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { Trips } from '../../interfaces';
import { TripNextPipe } from './trip-next.pipe';

@IonicPage()
@Component({
  selector: 'page-bus-trip-info-modal',
  templateUrl: 'bus-trip-info-modal.html',
})
export class BusTripInfoModalPage {

  trips: Trips[];
  tripDetails: any;
  nextTrip: string;

  modalSegment = 'timings';

  constructor(public navParams: NavParams, private viewCtrl: ViewController) { }

  ionViewDidLoad() {
    this.trips = this.navParams.get('trips');
    this.tripDetails = this.navParams.get('tripDetails');
    this.modalSegment = this.navParams.get('section');
    this.nextTrip = this.navParams.get('nextTrip');
  }

  swipeDown(event: any) {
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
