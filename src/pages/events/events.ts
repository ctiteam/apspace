import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize, tap } from 'rxjs/operators';
import { EventsProvider } from '../../providers';

import { ExamSchedule, FeesTotalSummary, StudentProfile } from '../../interfaces';
import { WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  upcomingClass$: Observable<any[]>;
  holidays$: Observable<any[]>;
  exam$: Observable<ExamSchedule[]>;

  classes: boolean;
  exam: boolean;

  type = 'doughnut';
  data: any;
  numOfSkeletons = new Array(5);
  isLoading: boolean;

  options = {
    legend: {
      display: true,
    },
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
      tap(c => this.classes = c.length !== 0),
      tap(_ => this.getOverdueFee()),
      tap(_ => this.getUpcomingExam()),
      finalize(() => { refresher && refresher.complete(), this.isLoading = false; }),
    );
    this.upcomingClass$.subscribe();
  }

  getOverdueFee() {
    this.ws.get('/student/summary_overall_fee', true).pipe(
      tap(c => this.getDougnutChart(c[0].TOTAL_PAID, c[0].TOTAL_PAYABLE, c[0].TOTAL_OVERDUE)),
    ).subscribe();
  }

  getUpcomingExam() {
    this.ws.get<StudentProfile>('/student/profile')
    .subscribe(p => {
      const url = `/examination/${p.INTAKE}`;
      const opt = { auth: false };
      this.exam$ = this.ws.get<ExamSchedule[]>(url, true, opt).pipe(
        tap(e => this.exam = e.length !== 0),
      );
    });
  }

  getDougnutChart(totalPaid: any, totalPayable: any, overdue: any) {
    const randomColor = [
      'rgba(75, 192, 192, 1)',
      'rgba(255,99,132,1)',
    ];
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

  openExamPage() {
    this.app.getRootNav().push('ExamSchedulePage');
  }

  /** Open staff info for lecturer id. */
  openStaffDirectoryInfo(id: string) {
    this.app.getRootNav().push('StaffDirectoryInfoPage', { id });
  }
}
