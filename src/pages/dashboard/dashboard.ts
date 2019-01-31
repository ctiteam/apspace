import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  App,
  IonicPage,
  NavController,
  NavParams,
  Content,
  Events,
  Platform
} from "ionic-angular";

import { Observable } from "rxjs/Observable";
import {
  concatMap,
  finalize,
  flatMap,
  map,
  share,
  tap,
  toArray
} from "rxjs/operators";

import {
  Apcard,
  Attendance,
  Course,
  CourseDetails,
  ExamSchedule,
  FeesTotalSummary,
  Holiday,
  Holidays,
  StudentProfile
} from "../../interfaces";
import {
  SettingsProvider,
  WsApiProvider,
  AppAnimationProvider,
  NotificationProvider
} from "../../providers";

@IonicPage()
@Component({
  selector: "page-dashboard",
  templateUrl: "dashboard.html"
})
export class DashboardPage {
  @ViewChild(Content) content: Content;

  // OBSERVABLES
  attendance$: Observable<Attendance[]>;
  attendancePercent$: Observable<number>;
  courseDetails$: Observable<CourseDetails>;
  exam$: Observable<ExamSchedule[]>;
  intake$: Observable<Course[]>;
  nextHoliday$: Observable<Holiday>;
  overdue$: Observable<FeesTotalSummary[]>;
  profile$: Observable<StudentProfile>;
  transaction$: Observable<Apcard>;
  visa$: Observable<any>;
  apcardTransaction$: Observable<Apcard[]>;

  // LOADING VARS
  numOfSkeletons = new Array(2);

  // ATTENDANCE VARS 
  overallAttendance: number;
  subject: string;
  
  // VISA VARS 
  local: boolean = false;

  // HEADER VARS
  greetingMessage = "";
  badge: string;

  // APCARD TRANSACTIONS VARS
  monthlyData: any;
  monthly: number;
  apcardChartData: any;
  balance: number;

  // GPA PER INTAKE VARS
  barChartData: any;
  block: boolean = false;

  // CHARTS OPTIONS AND TYPES VARS
  type = ["horizontalBar", "line"];
  options = [
    {
      legend: {
        display: true,
        position: "right"
      }
    },
    {
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              max: 4
            }
          }
        ]
      }
    }
  ];

  // GENERAL METHODS
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public ws: WsApiProvider,
    public settings: SettingsProvider,
    private appAnimationProvider: AppAnimationProvider,
    private elRef: ElementRef,
    public events: Events,
    public notification: NotificationProvider,
    private plt: Platform
  ) {
    this.events.subscribe("newNotification", () => {
      this.getBadge();
    });
  }

  ionViewDidLoad() {
    this.doRefresh();
    this.appAnimationProvider.addAnimationsToSections(this.elRef);
    // ON PAGE SCROLL
    this.content.ionScroll.subscribe((ev: any) => {
      this.appAnimationProvider.addAnimationsToSections(this.elRef);
    });
  }

  ionViewWillEnter() {
    if (this.plt.is("cordova")) {
      this.getBadge();
    }
  }

  doRefresh(refresher?) {
    this.displayGreetingMessage();
    this.profile$ = this.ws.get<StudentProfile>("/student/profile");
    this.nextHoliday$ = this.getHolidays(refresher);
    this.getProfile();
    this.transaction$ = this.getAPCardBalance();
    this.overdue$ = this.getOverdueFee();
    this.apcardTransaction$ = this.ws.get<Apcard[]>("/apcard/", true).pipe(
      map(t => this.signTransactions(t)),
      tap(t => this.analyzeTransactions(t)),
      finalize(() => refresher && refresher.complete())
    );
  }

  openPage(page: string) {
    this.app.getRootNav().push(page);
  }

  // HOLIDAYS METHODS
  getHolidays(refresh: boolean) {
    const now = new Date();
    return this.ws
      .get<Holidays>("/transix/holidays/filtered/students", refresh)
      .pipe(
        map(
          res =>
            res.holidays.find(h => now < new Date(h.holiday_start_date)) ||
            ({} as Holiday)
        )
      );
  }

  // UPCOMING EXAMS METHODS
  getUpcomingExam(intake: string) {
    const opt = { auth: false };
    this.exam$ = this.ws.get<ExamSchedule[]>(
      `/examination/${intake}`,
      true,
      opt
    );
  }

  // VISA METHODS
  getVisaStatus() {
    return this.ws.get<any>("/student/visa_status");
  }

  // FEES & OUTSTANDING METHODS
  getOverdueFee() {
    return this.ws.get<FeesTotalSummary[]>(
      "/student/summary_overall_fee",
      true
    );
  }

  // GPA METHODS
  getGPA() {
    this.ws
      .get<Course[]>("/student/courses")
      .pipe(
        flatMap(intakes => intakes),
        concatMap(intake => {
          const url = `/student/sub_and_course_details?intake=${
            intake.INTAKE_CODE
          }`;
          return this.ws.get<CourseDetails>(url, true).pipe(
            map(intakeDetails =>
              Object.assign({
                intakeDate: intake.INTAKE_NUMBER,
                intakeCode: intake.INTAKE_CODE,
                intakeDetails
              })
            )
          );
        }),
        toArray()
      )
      .subscribe(d => {
        const data = Array.from(
          new Set(
            (d || []).map(t => ({
              intakeCode: t.intakeCode,
              gpa: t.intakeDetails.slice(-1)[0]
            }))
          )
        );
        const filteredData = data.filter(res => res.gpa.INTAKE_GPA);
        const labels = filteredData.map(i => i.intakeCode);
        const gpa = filteredData.map(i => i.gpa.INTAKE_GPA);

        const color = [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(54,72,87,0.7)",
          "rgba(247,89,64,0.7)",
          "rgba(61,199,190,0.7)"
        ];

        const borderColor = [
          "rgba(255,99,132,1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(54,72,87,1)",
          "rgba(247,89,64,1)",
          "rgba(61,199,190,1)"
        ];

        this.barChartData = {
          labels,
          datasets: [
            {
              backgroundColor: color,
              borderColor,
              borderWidth: 2,
              data: gpa
            }
          ]
        };
      });
  }

  // ATTENDANCE METHODS
  getAttendance(intake: string) {
    const url = `/student/attendance?intake=${intake}`;
    this.attendance$ = this.ws.get<Attendance[]>(url, true).pipe(
      map(attendances => {
        const currentSemester = Math.max(
          ...attendances.map(attendance => attendance.SEMESTER)
        );
        return (attendances || []).filter(
          attendance =>
            attendance.SEMESTER === currentSemester &&
            attendance.PERCENTAGE < 80
        );
      }),
      tap(
        attendances =>
          (this.subject = attendances[0] && attendances[0].SUBJECT_CODE)
      ),
      share()
    );
    this.attendancePercent$ = this.ws
      .get<Attendance[]>(url)
      .pipe(
        map(aa => aa.reduce((a, b) => a + b.PERCENTAGE, 0) / aa.length / 100)
      );
  }

  // HEADER METHODS
  capitalizeString(text: string) {
    let capitalizedString =
      text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
    return capitalizedString;
  }
  displayGreetingMessage() {
    let hoursNow = new Date().getHours();
    if (hoursNow < 12) {
      this.greetingMessage = "Good morning";
    } else if (hoursNow >= 12 && hoursNow <= 18) {
      this.greetingMessage = "Good afternoon";
    } else {
      this.greetingMessage = "Good evening";
    }
  }

  getProfile() {
    this.ws
      .get<StudentProfile>("/student/profile")
      .pipe(
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
          if (p.COUNTRY === "Malaysia") {
            this.local = true;
          } else {
            this.local = false;
            this.visa$ = this.getVisaStatus();
          }
        })
      )
      .subscribe();
  }

  // APCARD TRANSACTIONS & BALANCE METHODS
  getAPCardBalance() {
    return this.ws
      .get<Apcard>("/apcard/", true)
      .pipe(
        map(transactions => (transactions[0] || ({} as Apcard)).Balance || 0)
      );
  }

  /** Analyze transactions. */
  analyzeTransactions(transactions: Apcard[]) {
    // stop analyzing if transactions is empty
    if (transactions.length === 0) {
      return;
    }
    this.balance = transactions[0].Balance;

    const now = new Date();
    const a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.monthlyData = transactions.reduce(
      (tt, t) => {
        const c = t.SpendVal > 0 ? "dr" : "cr"; // classify spent type
        const d = new Date(t.SpendDate);
        d.getFullYear() in tt[c] || (tt[c][d.getFullYear()] = a.slice());
        tt[c][d.getFullYear()][d.getMonth()] += Math.abs(t.SpendVal);

        return tt;
        // default array with current year
      },
      {
        dr: { [now.getFullYear()]: a.slice() },
        cr: { [now.getFullYear()]: a.slice() }
      }
    );
    // plot graph
    this.apcardChartData = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      datasets: [
        {
          label: "Monthly Credit",
          data: this.monthlyData.cr[now.getFullYear()],
          borderColor: "rgba(0, 200, 83, .5)",
          backgroundColor: "rgba(0, 200, 83, .5)",
          fill: false
        },
        {
          label: "Monthly Debit",
          data: this.monthlyData.dr[now.getFullYear()],
          borderColor: "rgba(230, 0, 0, .5)",
          backgroundColor: "rgba(230, 0, 0, .5)",
          fill: false
        }
      ]
    };

    // reverse monthlyData last year
    this.monthly = this.monthlyData.dr[now.getFullYear()][now.getMonth()];
  }

  /** Negate spend value for top ups. */
  signTransactions(transactions: Apcard[]): Apcard[] {
    transactions.forEach(transaction => {
      if (transaction.ItemName === "Top Up") {
        transaction.SpendVal *= -1;
      }
    });
    return transactions;
  }

  // NOTIFICATIONS METHODS
  getBadge() {
    this.notification.getMessage().subscribe(res => {
      this.badge = res.num_of_unread_msgs;
    });
  }
}
