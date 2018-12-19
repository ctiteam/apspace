import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { concatMap, finalize, flatMap, map, share, tap, toArray } from 'rxjs/operators';

import {
  Apcard, Attendance, Course, CourseDetails, ExamSchedule, FeesTotalSummary,
  Holiday, Holidays, StudentProfile,
} from '../../interfaces';
import { WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  attendance$: Observable<Attendance[]>;
  attendancePercent$: Observable<number>;
  courseDetails$: Observable<CourseDetails>;
  exam$: Observable<ExamSchedule[]>;
  intake$: Observable<Course[]>;
  nextHoliday$: Observable<Holiday>;
  overdue$: Observable<FeesTotalSummary[]>;
  profile$: Observable<StudentProfile>;
  transaction$: Observable<Apcard>;
  upcomingClass$: Observable<any[]>;
  visa$: Observable<any>;

  numOfSkeletons = new Array(2);

  type = ['pie', 'horizontalBar'];
  pieChartData: any;
  barChartData: any;
  totalClasses: number;
  overallAttendance: number;
  subjectCode: string;
  percent: number;
  subject: string;
  block: boolean = false;
  local: boolean = false;

  options = [
    {
      legend: {
        display: true,
        position: 'right',
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
    },
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public ws: WsApiProvider,
  ) { }

  ionViewDidLoad() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.totalClasses = undefined;
    this.upcomingClass$ = this.ws.get<any[]>('/student/upcoming_class', refresher).pipe(
      tap(cc => this.totalClasses = cc.length),
      finalize(() => refresher && refresher.complete()),
    );
    this.nextHoliday$ = this.getHolidays(refresher);
    this.getProfile();
    this.transaction$ = this.getAPCardBalance();
    this.overdue$ = this.getOverdueFee();
  }

  getAPCardBalance() {
    return this.ws.get<Apcard>('/apcard/', true).pipe(
      map(transactions => (transactions[0] || {} as Apcard).Balance || 0),
    );
  }

  getHolidays(refresh: boolean) {
    const now = new Date();
    return this.ws.get<Holidays>('/transix/holidays/filtered/students', refresh).pipe(
      map(res => res.holidays.find(h => now < new Date(h.holiday_start_date))),
    );
  }

  getProfile() {
    this.ws.get<StudentProfile>('/student/profile').pipe(
      tap(p => {
        if (p.BLOCK === true) {
          this.block = false;
          this.getGPA();
        } else {
          this.block = true;
        }
      }),
      tap(p => this.getAttendance(p.INTAKE)),
      tap(p => this.getUpcomingExam(p.INTAKE)),
      tap(p => {
        if (p.COUNTRY === 'Malaysia') {
          this.local = true;
        } else {
          this.local = false;
          this.visa$ = this.getVisaStatus();
        }
      }),
    ).subscribe();
  }

  getUpcomingExam(intake: string) {
    const opt = { auth: false };
    this.exam$ = this.ws.get<ExamSchedule[]>(`/examination/${intake}`, true, opt);
  }

  getVisaStatus() {
    return this.ws.get<any>('/student/visa_status');
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
    return this.ws.get<FeesTotalSummary[]>('/student/summary_overall_fee', true);
  }

  getGPA() {
    this.ws.get<Course[]>('/student/courses').pipe(
      flatMap(intakes => intakes),
      concatMap(intake => {
        const url = `/student/sub_and_course_details?intake=${intake.INTAKE_CODE}`;
        return this.ws.get<CourseDetails>(url, true).pipe(
          map(intakeDetails => Object.assign({
            intakeDate: intake.INTAKE_NUMBER,
            intakeCode: intake.INTAKE_CODE,
            intakeDetails,
          })),
        );
      }),
      toArray(),
    ).subscribe(d => {
      const data = Array.from(new Set((d || []).map(t => ({
        intakeCode: t.intakeCode,
        gpa: t.intakeDetails.slice(-1)[0],
      }))));
      const filteredData = data.filter(res => res.gpa.INTAKE_GPA);
      const labels = filteredData.map(i => i.intakeCode);
      const gpa = filteredData.map(i => i.gpa.INTAKE_GPA);

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
        labels,
        datasets: [
          {
            backgroundColor: color,
            borderColor,
            borderWidth: 2,
            data: gpa,
          },
        ],
      };
    });
  }

  getAttendance(intake: string) {
    const url = `/student/attendance?intake=${intake}`;
    this.attendance$ = this.ws.get<Attendance[]>(url, true).pipe(
      map(attendances => (attendances || []).filter(attendance => attendance.PERCENTAGE < 80)),
      tap(attendances => attendances.length > 0 && this.getPieChart(
        attendances[0].TOTAL_CLASSES, attendances[0].TOTAL_ABSENT,
        attendances[0].SUBJECT_CODE, attendances[0].PERCENTAGE)),
      tap(attendances => this.subject = attendances[0] && attendances[0].SUBJECT_CODE),
      share(),
    );
    this.attendancePercent$ = this.ws.get<Attendance[]>(url).pipe(
      map(aa => aa.reduce((a, b) => a + b.PERCENTAGE, 0) / aa.length / 100),
    );
  }

  getPieChart(totalClasses: number, totalAbsent: number, code: string, percent: number) {
    this.subjectCode = code;
    this.percent = percent;
    const attendedClasses = totalClasses - totalAbsent;
    this.pieChartData = {
      datasets: [{
        data: [attendedClasses, totalAbsent],
        backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255,99,132,1)'],
      }],
      labels: [
        `Attended Classes: ${attendedClasses}`,
        `Total Absent: ${totalAbsent}`,
      ],
    };
  }

  /** Open staff info for lecturer id. */
  openStaffDirectoryInfo(id: string) {
    this.app.getRootNav().push('StaffDirectoryInfoPage', { id });
  }

  openPage(page: string) {
    this.app.getRootNav().push(page);
  }
}
