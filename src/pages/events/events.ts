import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { concatMap, finalize, flatMap, tap, toArray, map} from 'rxjs/operators';
import { EventsProvider, WsApiProvider } from '../../providers';
import {
  ExamSchedule,
  Attendance,
  StudentProfile,
  Course,
  CourseDetails,
} from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  upcomingClass$: Observable<any[]>;
  exam$: Observable<ExamSchedule[]>;
  intake$: Observable<Course[]>;
  courseDetails$: Observable<CourseDetails>;

  classes: boolean;
  exam: boolean;
  holidays: any;
  date;
  percent: any;
  averageColor: string;

  type = ['doughnut', 'horizontalBar'];
  data: any;
  barChartData: any;
  numOfSkeletons = new Array(5);
  isLoading: boolean;

  options = [
    {
      legend: {
        display: true,
      },
    },
    {
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
            max: 4,
          },
        }],
      },
    }
  ]

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
        const url = `/examination/${p.INTAKE}`;
        const opt = { auth: false };
        this.exam$ = this.ws.get<ExamSchedule[]>(url, true, opt).pipe(
          tap(_ => this.getAttendance(p.INTAKE, p.STUDENT_NUMBER)),
          tap(_ => this.getGPA(p.STUDENT_NUMBER)),
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

  /** Retrieve GPA.
   *
   * @param id - student id
   */
  getGPA(id: string) {
    this.ws.get<Course[]>('/student/courses').pipe(
      flatMap(intakes => intakes),
      concatMap(intake => {
        const url = `/student/sub_and_course_details?intake=${intake.INTAKE_CODE}`;
        return this.ws.get<CourseDetails>(url, true, { params: { id } }).pipe(
          map(intakeDetails => Object.assign({
            intakeDate: intake.INTAKE_NUMBER,
            intakeCode: intake.INTAKE_CODE,
            intakeDetails
          }))
        );
      }),
      toArray(),
    ).subscribe(d => {
      let data = Array.from(new Set((d || []).map(t =>
        Object.assign({
          intakeCode: t.intakeCode,
          gpa: t.intakeDetails.slice(-1)[0]
        })
      )));
      let filteredData = data.filter(res => res.gpa.INTAKE_GPA);
      let labels = [];
      let gpa = [];
      for (let intake of filteredData) {
        labels.push(intake.intakeCode);
        gpa.push(intake.gpa.INTAKE_GPA);
      }

      const randomColor = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(54,72,87,0.7)',
        'rgba(247,89,64,0.7)',
        'rgba(61,199,190,0.7)',
      ];

      const randomBorderColor = [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(54,72,87,1)',
        'rgba(247,89,64,1)',
        'rgba(61,199,190,1)',
      ];

      this.barChartData = {
        labels: labels,
        datasets: [
          {
            backgroundColor: randomColor,
            borderColor: randomBorderColor,
            borderWidth: 2,
            data: gpa,
          },
        ],
      };
    });
  }

  getAttendance(intake: string, studentID: string) {
    const opt = { params: { id: studentID } };
    this.ws.get<Attendance[]>(`/student/attendance?intake=${intake}`, true, opt)
      .pipe(
        tap(attendances => {
          let sumOfAttendances = 0;
          if (!attendances) {
            this.percent = 0;
            this.averageColor = '#f04141';
          } else {
            for (const attendance of attendances) {
              sumOfAttendances += attendance.PERCENTAGE;
            }
            const averageAttendance = (sumOfAttendances / attendances.length).toFixed(2);
            this.percent = parseInt(averageAttendance, 10);
            this.averageColor = '#0dbd53';
            if (this.percent < 80) {
              this.averageColor = '#f04141';
            }
          }
        })
      ).subscribe();
  }

  openExamPage() {
    this.app.getRootNav().push('ExamSchedulePage');
  }

  /** Open staff info for lecturer id. */
  openStaffDirectoryInfo(id: string) {
    this.app.getRootNav().push('StaffDirectoryInfoPage', { id });
  }
}
