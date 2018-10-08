import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { EventsProvider } from '../../providers';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  upcomingClass$: Observable<any[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public eventsProvider: EventsProvider,
  ) {}

  ionViewDidLoad(){
    this.upcomingClass$ = this.eventsProvider.getUpcomingClass();
  }
}
