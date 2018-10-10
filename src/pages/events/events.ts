import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

import { EventsProvider } from '../../providers';
import { Observable } from 'rxjs/Observable';
import { tap, finalize } from 'rxjs/operators';

import { WsApiProvider } from '../../providers';
import { FeesTotalSummary } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  upcomingClass$: Observable<any[]>;
  holidays$: Observable<any[]>;

  classes: boolean;

  type = 'doughnut';
  data: any;
  numOfSkeletons = new Array(5);
  isLoading: boolean;

  options = {
    legend: {
      display: true,
    }
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public eventsProvider: EventsProvider,
    public app: App,
    public ws: WsApiProvider,
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
    this.ws.get('/student/summary_overall_fee', true).pipe(
      tap(c => this.getDougnutChart(c[0].TOTAL_PAID, c[0].TOTAL_PAYABLE, c[0].TOTAL_OVERDUE))
    ).subscribe();
  }

  getDougnutChart(totalPaid: any, totalPayable: any, overdue: any) {
    const randomColor = [
      'rgba(75, 192, 192, 1)',
      'rgba(255,99,132,1)',
    ]
    this.data = {
      datasets: [{
        data: [totalPaid, overdue],
        backgroundColor: randomColor,
      }],
      labels: [
        `Total Paid: RM${totalPaid}`,
        `Total Overdue: RM${overdue}`,
      ],

    };
  }
  /** Open staff info for lecturer id. */
  openStaffDirectoryInfo(id: string) {
    this.app.getRootNav().push('StaffDirectoryInfoPage', { id });
  }
}
