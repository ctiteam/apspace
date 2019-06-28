import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  EventComponentConfigurations, DashboardCardComponentConfigurations,
  Attendance, StudentProfile, Apcard, FeesTotalSummary
} from 'src/app/interfaces';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { WsApiService } from 'src/app/services';
import { map, tap, share, finalize, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.page.html',
  styleUrls: ['./student-dashboard.page.scss'],
})
export class StudentDashboardPage implements OnInit {
  constructor(
    private ws: WsApiService
  ) { }

  // ALERTS SLIDER OPTIONS
  alertSliderOptions = {
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    speed: 500,
  };

  // ELEMENT REFs USED FOR CHARTS:
  @ViewChild('apcardChart') apcardChart: ElementRef;
  @ViewChild('cgpaChart') cgpaChart: ElementRef;
  @ViewChild('financialsChart') financialsChart: ElementRef;
  @ViewChild('lowAttendanceChart') lowAttendanceChart: ElementRef;

  // CHARTS TYPES:
  apcardChartType = 'line';
  cgpaChartType = 'horizontalBar';
  lowAttendanceChartType = 'horizontalBar';
  financialsChartType = 'bar';

  // CHARTS OPTIONS:
  apcardChartOptions = [
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
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              max: 4,
            },
          },
        ],
      },
    },
  ];

  cgpaChartOptions = {
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          max: 4
        }
      },
      ],
      yAxes: [{
        gridLines: {
          color: 'rgba(0, 0, 0, 0)',
        },
        ticks: {
          beginAtZero: true,
          mirror: true,
          padding: -10
        },
      }]
    },
    responsive: true,
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  };

  financialsChartOptions = {
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ stacked: true }]
    }
  };

  lowAttendanceChartOptions = {
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          max: 80
        }
      },
      ],
      yAxes: [{
        gridLines: {
          color: 'rgba(0, 0, 0, 0)',
        },
        ticks: {
          beginAtZero: true,
          mirror: true,
          padding: -10
        },
      }]
    },
    responsive: true,
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  };

  // DASHBOARD CARDS CONFIGURATIONS:
  todaysScheduleCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: true,
    options: [
      {
        title: 'set alarm before 15 minutes of next schdule',
        icon: 'alarm',
        callbackFunction: this.testCallBack
      },
      {
        title: 'delete',
        icon: 'trash',
        callbackFunction: this.testCallBack
      }
    ],
    cardTitle: 'Today\'s Schedule',
    cardSubtitle: 'Next in: 1 hrs, 25 min'
  };

  upcomingEventsCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: true,
    options: [
      {
        title: 'set alarm before 15 minutes of next schdule',
        icon: 'alarm',
        callbackFunction: this.testCallBack
      },
      {
        title: 'delete',
        icon: 'trash',
        callbackFunction: this.testCallBack
      }
    ],
    cardTitle: 'Upcoming Events',
    cardSubtitle: 'Today: ' + moment().format('DD MMMM YYYY')
  };

  apcardTransactionsCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: false,
    cardTitle: 'APCard Transactions',
    cardSubtitle: 'Balance: RM500.99',
    contentPadding: true
  };

  financialsCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: false,
    cardTitle: 'Financials:',
    cardSubtitle: 'Overdue: RM5000',
    contentPadding: true
  };

  cgpaCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: false,
    cardTitle: 'CGPA Per Intake',
    cardSubtitle: 'Overall: 3.9',
    contentPadding: true
  };

  lowAttendanceCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: false,
    cardTitle: 'Low Attendance:',
    cardSubtitle: 'Overall: 80%',
    contentPadding: true
  };

  // PROFILE
  greetingMessage = '';
  defaultIntake = '';
  studentFirstName = '';
  block = false;

  // ATTENDANCE
  attendance$: Observable<Attendance[]>;
  attendancePercent$: Observable<{ value: number }>;
  subject: string;

  // APCARD
  balance$: Observable<{ value: number }>;

  apcardChartData = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'Monthly Credit',
        data: ['22', '10', '14', '30', '0', '0', '12', '100', '201', '10', '0', '0'],
        borderColor: 'rgba(46, 204, 113, .7)',
        backgroundColor: 'rgba(46, 204, 113, .3)',
        fill: true,
      },
      {
        label: 'Monthly Debit',
        data: ['12', '15', '27', '1', '200', '10', '2', '10', '21', '0', '20', '50'],
        borderColor: 'rgba(192, 57, 43, .7)',
        backgroundColor: 'rgba(192, 57, 43, .3)',
        fill: true,
      },
    ],
  };

  // FEES
  totalOverdue$: Observable<{ value: number }>;

  // return this.ws
  // .get<Apcard[]>('/apcard/', true)
  // .pipe(
  //   map((transactions) => {
  //     if (transactions.length > 0) {
  //       return (transactions[0] || ({} as Apcard)).Balance;
  //     }
  //     return -1;
  //   }),
  // );

  cgpaChartData = {
    labels: [
      'UC1F1506IT',
      'UC2F1605IT(ISS)',
      'UC3F1706IT(ISS)'
    ],
    datasets: [
      {
        data: [3.8, 3.3, 3.5],
        backgroundColor: ['rgb(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
      }]
  };

  financialsChartData = {
    labels: ['Financial Status'],
    datasets: [
      {
        label: 'Paid',
        data: [55172],
        backgroundColor: '#D6E9C6' // green
      },
      {
        label: 'Outstanding',
        data: [6000],
        backgroundColor: '#FAEBCC' // yellow
      },
      {
        label: 'Overdue',
        data: [4000],
        backgroundColor: '#EBCCD1' // red
      }
    ]
  };

  lowAttendanceChartData = {
    labels: [
      'Introductions to Management',
      'Computing and IT in Workplace',
      'Designing and Developing applications on the cloud'
    ],
    datasets: [
      {
        data: [65, 71, 38],
        backgroundColor: ['rgb(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
      }]
  };

  // TO BE DELETED (MOCK DATA)
  todaysSchedule: EventComponentConfigurations[] = [{
    title: '1 hour class',
    color: '#27ae60',
    type: 'event-with-time-and-hyperlink',
    primaryDateTime: '08',
    secondaryDateTime: '30',
    quaternaryDateTime: 'AM',
    thirdDescription: 'Lower Ground Flr. SS Studio | New Campus',
    secondDescription: 'Mohamad Al Ghayeb',
    firstDescription: 'BM002-3-1-BES-T-2',
    pass: true
  },
  {
    title: '2 hours class',
    color: '#27ae60',
    type: 'event-with-time-and-hyperlink',
    primaryDateTime: '10',
    secondaryDateTime: '00',
    quaternaryDateTime: 'AM',
    thirdDescription: 'B-05-03 | New Campus',
    secondDescription: 'M. Reza Ganji',
    firstDescription: 'KS004-3-3-BAT-L-5',
    pass: true
  },
  {
    title: '2 hours class',
    color: '#27ae60',
    type: 'event-with-time-and-hyperlink',
    primaryDateTime: '02',
    secondaryDateTime: '00',
    quaternaryDateTime: 'PM',
    thirdDescription: 'B-07-03 | New Campus',
    secondDescription: 'Majd Samer Ahemd Suraj Al Waleed',
    firstDescription: 'AW004-3-3-BAT-L-5',
    pass: false
  },
  {
    title: 'Metting with Masters Supervisor',
    color: '#d35400',
    type: 'event-with-time-and-hyperlink',
    primaryDateTime: '02',
    secondaryDateTime: '30',
    quaternaryDateTime: 'PM',
    thirdDescription: 'B-07-03 | New Campus',
    secondDescription: 'M. Reza Ganji',
    firstDescription: 'reza.ganji@apiit.edu.my',
    pass: false
  },
  {
    title: 'Meeting with Dean',
    color: '#d35400',
    type: 'event-with-time-and-hyperlink',
    primaryDateTime: '04',
    secondaryDateTime: '00',
    quaternaryDateTime: 'PM',
    thirdDescription: 'LAB L3 - 08 | TPM',
    secondDescription: 'M. Reza Ganji',
    firstDescription: 'reza.ganji@apiit.edu.my',
    pass: false
  }
  ];

  upcomingEvents: EventComponentConfigurations[] = [{
    title: 'Hari Raya Holiday',
    color: '#121230',
    type: 'event-with-date-only',
    primaryDateTime: '22',
    secondaryDateTime: 'Jan',
    quaternaryDateTime: '2019',
    secondDescription: 'Until: 25 Jan 2019',
    firstDescription: 'Hari raya is blah blah blah',
    pass: false
  },
  {
    title: 'APU Football Competition',
    color: '#d35400',
    type: 'event-with-date-only',
    primaryDateTime: '25',
    secondaryDateTime: 'Sep',
    quaternaryDateTime: '2019',
    secondDescription: 'One day event',
    firstDescription: 'Hari raya is blah blah blah',
    thirdDescription: 'APU football pitch',
    pass: false
  },
  {
    title: 'Hari Raya Holiday Season 2',
    color: '#121230',
    type: 'event-with-date-only',
    primaryDateTime: '22',
    secondaryDateTime: 'Jan',
    quaternaryDateTime: '2019',
    secondDescription: 'Until: 25 Jan 2019',
    firstDescription: 'Hari raya is blah blah blah',
    pass: false
  },
  ];

  ngOnInit() {
    this.doRefresh();
    this.createChart(this.apcardChart, this.apcardChartType, this.apcardChartOptions, this.apcardChartData);
    this.createChart(this.cgpaChart, this.cgpaChartType, this.cgpaChartOptions, this.cgpaChartData);
    this.createChart(this.financialsChart, this.financialsChartType, this.financialsChartOptions, this.financialsChartData);
    this.createChart(this.lowAttendanceChart, this.lowAttendanceChartType, this.lowAttendanceChartOptions, this.lowAttendanceChartData);
  }

  doRefresh(refresher?) {
    this.displayGreetingMessage();
    // this.profile$ = this.ws.get<StudentProfile>('/student/profile');
    // this.apcardTransaction$ = this.getTransactions();
    forkJoin(
      this.getProfile(),
      // this.upcomingConsultation$ = this.getUpcomingConsultations(),
      // this.nextHoliday$ = this.getHolidays(Boolean(refresher)),
      this.balance$ = this.getAPCardBalance(),
      this.totalOverdue$ = this.getOverdueFee(),
    ).pipe(finalize(() => refresher && refresher.complete())).subscribe();
  }

  // CREATING CHARTS METHOD:
  createChart(elementRef: ElementRef, chartType: string, chartOptions: {}[] | {}, chartData: any) {
    const ctx = elementRef.nativeElement.getContext('2d');
    const chartToCreate = new Chart(ctx, {
      type: chartType,
      options: chartOptions,
      data: chartData
    });
  }
  getProfile() {
    return this.ws.get<StudentProfile>('/student/profile').pipe(
      tap(data => console.log(data)),
      // tap(studentProfile => {
      //   if (studentProfile.BLOCK === true) {
      //     this.block = false;
      //     this.getGPA();
      //   } else {
      //     this.block = true;
      //   }
      // }),
      tap(studentProfile => this.studentFirstName = studentProfile.NAME.split(' ')[0]),
      tap(studentProfile => this.defaultIntake = studentProfile.INTAKE),
      // tap(studentProfile => this.getUpcomingClasses(studentProfile.INTAKE)),
      tap(studentProfile => this.getAttendance(studentProfile.INTAKE)),
      // tap(studentProfile => this.getUpcomingExam(studentProfile.INTAKE)),
    );
  }

  displayGreetingMessage() {
    const hoursNow = new Date().getHours();
    if (hoursNow < 12) {
      this.greetingMessage = 'Good morning';
    } else if (hoursNow >= 12 && hoursNow <= 18) {
      this.greetingMessage = 'Good afternoon';
    } else {
      this.greetingMessage = 'Good evening';
    }
  }
  getAttendance(intake: string) {
    const url = `/student/attendance?intake=${intake}`;
    this.attendance$ = this.ws.get<Attendance[]>(url, true).pipe(
      map(attendances => {
        const currentSemester = Math.max(
          ...attendances.map(attendance => attendance.SEMESTER),
        );
        return (attendances || []).filter(
          attendance =>
            attendance.SEMESTER === currentSemester &&
            attendance.PERCENTAGE < 80,
        );
      }),
      tap(
        attendances =>
          (this.subject = attendances[0] && attendances[0].SUBJECT_CODE),
      ),
      tap(data => console.log(data)),
      share(),
    );
    this.attendancePercent$ = this.ws
      .get<Attendance[]>(url, true, { returnError: true })
      .pipe(
        map(aa => {
          if (aa.length > 0) {
            const totalClasses = aa.reduce((a, b) => a + b.TOTAL_CLASSES, 0);
            const totalAbsentClasses = aa.reduce((a, b) => a + b.TOTAL_ABSENT, 0);
            const totalAttendedClasses = totalClasses - totalAbsentClasses;
            return { value: totalAttendedClasses / totalClasses };
          } else {
            return { value: -1 }; // -1 means there is no attendance data in the selected intake
          }
        }),
        catchError(err => {
          return of({ value: -1 });
        })
      );
  }
  getAPCardBalance() {
    return this.ws
      .get<Apcard[]>('/apcard/', true)
      .pipe(
        map((transactions) => {
          if (transactions.length > 0) {
            return { value: (transactions[0] || ({} as Apcard)).Balance };
          }
          return { value: -1 };
        }),
    );
  }
  getOverdueFee() {
    return this.ws.get<FeesTotalSummary[]>(
      '/student/summary_overall_fee',
      true,
      { returnError: true }
    ).pipe(
      map((overdueSummary) => {
        return { value: overdueSummary[0].TOTAL_OVERDUE };
      }),
      tap(t => console.log(t)),
      catchError(err => {
        return of({ value: -1 });
      })
    );
  }

  testCallBack() {
    console.log('callback working');
  }
}
