import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize, tap, map } from 'rxjs/operators';
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
  exam$: Observable<ExamSchedule[]>;

  classes: boolean;
  exam: boolean;
  holidays: any;
  date;

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
      tap(_ => this.getOverdueFee()),
      tap(_ => this.getHolidays()),
      tap(_ => this.getUpcomingExam()),
      finalize(() => { refresher && refresher.complete(), this.isLoading = false; }),
    );
  }

  getHolidays() {
    let now = new Date();
    const months = {
      'January': 0,
      'February': 1,
      'March': 2,
      'April': 3,
      'May': 4,
      'June': 5,
      'July': 6,
      'August': 7,
      'September': 8,
      'October': 9,
      'November': 10,
      'December': 11,
    };
    this.eventsProvider.getHolidays().pipe(
      map(response => {
        let holidaysA = response.holidays;
        for (let holiday of holidaysA) {
          let holidayDate = new Date();
          holidayDate.setMonth(months[holiday.holiday_start_date.split('-')[1]]);
          holidayDate.setDate(+holiday.holiday_start_date.split('-')[0]);
          holidayDate.setMonth(months[holiday.holiday_end_date.split('-')[1]]);
          holidayDate.setDate(+holiday.holiday_end_date.split('-')[0]);
          holiday.holiday_start_date = holidayDate;
          holiday.holiday_end_date = holidayDate;
        }
        return holidaysA;
      })
    ).subscribe(holidays => {
      let filteredHoliday = holidays.filter(h => h.holiday_start_date >= now);
      if (filteredHoliday[0].holiday_start_date == filteredHoliday[0].holiday_end_date) {
        this.date = filteredHoliday[0].holiday_start_date;
      } else {
        this.date = `${filteredHoliday[0].holiday_start_date} - ${filteredHoliday[0].holiday_end_date}`;
      }
      this.holidays = filteredHoliday[0];
    });
  }

  getOverdueFee() {
    this.ws.get('/student/summary_overall_fee', true).pipe(
      tap(c => this.getDougnutChart(c[0].TOTAL_PAID, c[0].TOTAL_OVERDUE)),
    ).subscribe();
  }

  getUpcomingExam() {
    this.ws.get<StudentProfile>('/student/profile')
      .subscribe(p => {
        const url = `/examination/AFCF1801ICT`;
        const opt = { auth: false };
        this.exam$ = this.ws.get<ExamSchedule[]>(url, true, opt).pipe(
          tap(e => this.exam = e.length !== 0),
        );
      });
  }

  getDougnutChart(totalPaid: any, overdue: any) {
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
