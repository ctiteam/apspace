import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import {
  concatMap,
  finalize,
  flatMap,
  map,
  tap,
  toArray,
} from 'rxjs/operators';
import { EventsProvider, WsApiProvider } from '../../providers';
import {
  ExamSchedule,
  Attendance,
  StudentProfile,
  Course,
  CourseDetails,
  Holiday,
  Holidays,
  Apcard,
} from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  courseDetails$: Observable<CourseDetails>;
  exam$: Observable<ExamSchedule[]>;
  intake$: Observable<Course[]>;
  nextHoliday$: Observable<Holiday>;
  percent$: Observable<number>;
  profile$: Observable<StudentProfile>;
  upcomingClass$: Observable<any[]>;
  transaction$: Observable<Apcard>;

  numOfSkeletons = new Array(2);

  type = ['pie', 'horizontalBar'];
  pieChartData: any;
  barChartData: any;
  totalClasses: number;
  overallAttendance: number;
  overdueFee: number;
  attendances = [];
  subjectCode: string;
  percent: number;

  options = [
    {
      legend: {
        display: true,
        position: 'right'
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
    this.totalClasses = undefined;
    this.upcomingClass$ = this.eventsProvider.getUpcomingClass().pipe(
      tap(_ => this.getProfile()),
      tap(_ => this.getAPCardBalance()),
      tap(_ => this.getHolidays()),
      tap(_ => this.getOverdueFee()),
      tap(cc => this.totalClasses = cc.length),
      finalize(() => refresher && refresher.complete()),
    );
  }

  getAPCardBalance() {
    this.transaction$ = this.ws.get<Apcard>('/apcard/', true).pipe(
      map(transactions => transactions[0].Balance),
    )
  }

  getHolidays() {
    const now = new Date();
    this.nextHoliday$ = this.ws.get<Holidays>('/transix/holidays/filtered/students', true).pipe(
      map(res => res.holidays.find(h => now < new Date(h.holiday_start_date))),
    );
  }

  getProfile() {
    this.ws.get<StudentProfile>('/student/profile').pipe(
      tap(p => this.getAttendance(p.INTAKE, p.STUDENT_NUMBER)),
      tap(p => this.getUpcomingExam(p.INTAKE)),
      tap(p => this.getGPA(p.STUDENT_NUMBER)),
    ).subscribe();
  }

  getUpcomingExam(intake: string) {
    const opt = { auth: false };
    this.exam$ = this.ws.get<ExamSchedule[]>(`/examination/${intake}`, true, opt);
  }

  /** Convert string to color with djb2 hash function. */
  strToColor(str: string): string {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return '#' + [16, 8, 0].map(i => ('0' + (hash >> i & 0xFF).toString(16))
      .substr(-2)).join('');
  }

  getOverdueFee() {
    this.ws.get('/student/summary_overall_fee', true).pipe(
      map(fees => fees[0].TOTAL_OVERDUE),
      tap(overdue => this.overdueFee = overdue),
    ).subscribe();
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
      let labels = filteredData.map(i => i.intakeCode);
      let gpa = filteredData.map(i => i.gpa.INTAKE_GPA)

      const color = [
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

      const borderColor = [
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
            backgroundColor: color,
            borderColor: borderColor,
            borderWidth: 2,
            data: gpa,
          },
        ],
      };
    });
  }

  getAttendance(intake: string, studentID: string) {
    const url = `/student/attendance?intake=${intake}`;
    const opt = { params: { id: studentID } };
    this.percent$ = this.ws.get<Attendance[]>(url, true, opt).pipe(
      tap(attendances => {
        this.attendances = (attendances || []).filter(res => res.PERCENTAGE < 80);
        if (this.attendances.length > 0) {
          this.getPieChart(this.attendances[0].TOTAL_CLASSES, this.attendances[0].TOTAL_ABSENT, this.attendances[0].SUBJECT_CODE, this.attendances[0].PERCENTAGE);
        }
      }),
      map(attendances => attendances.reduce((a, b) => a + b.PERCENTAGE, 0) / attendances.length)
    );
  }

  getPieChart(totalClasses: number, totalAbsent: number, code: string, percent: number) {
    this.subjectCode = code;
    this.percent = percent;
    let attendedClasses = totalClasses - totalAbsent;
    this.pieChartData = {
      datasets: [{
        data: [attendedClasses, totalAbsent],
        backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255,99,132,1)'],
      }],
      labels: [
        `Attended Classes: ${attendedClasses}`,
        `Total Absent: ${totalAbsent}`,
      ]
    }
  }

  /** Open staff info for lecturer id. */
  openStaffDirectoryInfo(id: string) {
    this.app.getRootNav().push('StaffDirectoryInfoPage', { id });
  }
}
