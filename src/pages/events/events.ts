import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { EventsProvider } from '../../providers';
import { Observable } from 'rxjs/Observable';
import { tap, finalize } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  upcomingClass$: Observable<any[]>;
  holidays$: Observable<any[]>;

  classes: boolean;

  numOfSkeletons = new Array(5);
  isLoading: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public eventsProvider: EventsProvider,
  ) { }

  ionViewDidLoad() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.isLoading = true;
    this.upcomingClass$ = this.eventsProvider.getUpcomingClass().pipe(
      tap(c => {
        if (c.length == 0) {
          this.classes = false;
        } else {
          this.classes = true;
        }
      }),
      finalize(() => { refresher && refresher.complete(), this.isLoading = false; })
    )
    this.upcomingClass$.subscribe();
    this.holidays$ = this.eventsProvider.getHolidays();
  }
}
