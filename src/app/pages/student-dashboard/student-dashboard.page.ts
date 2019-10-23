import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { NavController, IonSelect, ModalController, IonSlides } from '@ionic/angular';
import { Observable, combineLatest, forkJoin, of, zip } from 'rxjs';
import { map, tap, share, finalize, catchError, flatMap, concatMap, toArray } from 'rxjs/operators';

import { WsApiService, StudentTimetableService, UserSettingsService, NotificationService, NewsService } from 'src/app/services';
import {
  EventComponentConfigurations, DashboardCardComponentConfigurations,
  Attendance, StudentProfile, Apcard, FeesTotalSummary, Course, CourseDetails,
  CgpaPerIntake, StudentTimetable, ConsultationHour, StudentPhoto, Holidays,
  Holiday, ExamSchedule, BusTrips, APULocations, APULocation, News
} from 'src/app/interfaces';

import * as moment from 'moment';
import { DragulaService } from 'ng2-dragula';
import { NewsModalPage } from '../news/news-modal';
@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.page.html',
  styleUrls: ['./student-dashboard.page.scss'],
})
export class StudentDashboardPage implements OnInit, OnDestroy, AfterViewInit {
  // USER SETTINGS
  @ViewChild('dragulaContainer', { static: true }) container: ElementRef; // access the dragula container
  @ViewChild('dashboardSectionsSelectBox', { static: true }) dashboardSectionsselectBoxRef: IonSelect; // hidden selectbox
  @ViewChild('slides', { static: false }) slides: IonSlides;
  dashboardSectionsSelectBoxModel; // select box dashboard sections value
  allDashboardSections = [ // alldashboardSections will not be modified and it will be used in the select box
    'quickAccess',
    'todaysSchedule',
    'upcomingEvents',
    'lowAttendance',
    'upcomingTrips',
    'apcard',
    'cgpa',
    'financials',
    'news',
    'noticeBoard'
  ];

  // dragulaModelArray will be modified whenever there is a change to the order of the dashboard sections
  dragulaModelArray = this.allDashboardSections;
  // shownDashboardSections get the data from local storage and hide/show elements based on that
  shownDashboardSections: string[];

  activeAccentColor = '';
  lowAttendanceChart: any;
  editableList = null;
  busShuttleServiceSettings: any;
  secondLocation: string;
  firstLocation: string;

  // PROFILE
  photo$: Observable<StudentPhoto>;
  greetingMessage = '';
  defaultIntake = '';
  studentFirstName$: Observable<string>;
  block = false;
  numberOfUnreadMsgs: number;

  // TODAY'S SCHEDULE
  todaysSchedule$: Observable<EventComponentConfigurations[] | any>;
  todaysScheduleCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: false,
    cardTitle: 'Today\'s Schedule',
  };

  // UPCOMING EVENTS
  upcomingEvent$: Observable<EventComponentConfigurations[]> | any;
  upcomingEventsCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: false,
    cardTitle: 'Upcoming Events',
    cardSubtitle: 'Today: ' + moment().format('DD MMMM YYYY')
  };

  // ATTENDANCE
  modulesWithLowAttendance$: Observable<Attendance[]>;
  overallAttendancePercent$: Observable<{ value: number }>;
  subject: string;
  lowAttendanceCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: false,
    cardTitle: 'Attendance Summary',
    contentPadding: true
  };

  // APCARD
  balance$: Observable<{ value: number }>;
  apcardTransaction$: Observable<Apcard[]>;
  monthlyData: any;
  currentBalance: number;
  apcardTransactionsCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: false,
    cardTitle: 'APCard Transactions',
    contentPadding: true
  };
  apcardChart = {
    type: 'line',
    options: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    data: {
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
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: 'rgb(73, 181, 113, .7)',
          backgroundColor: 'rgba(73, 181, 113, .3)',
          fill: true,
        },
        {
          label: 'Monthly Debit',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: 'rgb(224, 20, 57, .7)',
          backgroundColor: 'rgb(224, 20, 57, .3)',
          fill: true,
        },
      ],
    }
  };

  // FINANCIALS
  totalOverdue$: Observable<{ value: number }>;
  hasOutstanding: boolean;
  financial$: Observable<FeesTotalSummary>;
  financialsChart = {
    type: 'bar',
    options: {
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [{ stacked: true }]
      },
      responsive: true
    },
    data: {}
  };
  financialsCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: false,
    cardTitle: 'Financials',
    contentPadding: true
  };

  // TODAYS TRIPS
  upcomingTrips$: Observable<any>;
  showSetLocationsSettings = false;
  locations: APULocation[];
  busCardConfigurations: DashboardCardComponentConfigurations = {
    cardTitle: 'Upcoming Trips',
    contentPadding: false,
    withOptionsButton: false,
  };

  // NEWS
  news$: Observable<News[]>;
  newsCardConfigurations: DashboardCardComponentConfigurations = {
    cardTitle: 'Latest News',
    contentPadding: false,
    withOptionsButton: false
  };
  newsIndexToShow = 0; // open the first news section by default
  noticeBoardCardConfigurations: DashboardCardComponentConfigurations = {
    cardTitle: 'Notice Board',
    contentPadding: false,
    withOptionsButton: false
  };
  noticeBoardItems$: Observable<any[]>;
  noticeBoardSliderOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1.4,
    centeredContent: true,
    spaceBetween: 15,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    on: { // coverflow animation
      beforeInit() {
        const swiper = this;

        swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

        swiper.params.watchSlidesProgress = true;
        swiper.originalParams.watchSlidesProgress = true;
      },
      setTranslate() {
        const swiper = this;
        const {
          width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
        } = swiper;
        const params = swiper.params.coverflowEffect;
        const isHorizontal = swiper.isHorizontal();
        const transform$$1 = swiper.translate;
        const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
        const rotate = isHorizontal ? params.rotate : -params.rotate;
        const translate = params.depth;
        // Each slide offset from center
        for (let i = 0, length = slides.length; i < length; i += 1) {
          const $slideEl = slides.eq(i);
          const slideSize = slidesSizesGrid[i];
          const slideOffset = $slideEl[0].swiperSlideOffset;
          const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;

          let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
          let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
          // var rotateZ = 0
          let translateZ = -translate * Math.abs(offsetMultiplier);

          let translateY = isHorizontal ? 0 : params.stretch * (offsetMultiplier);
          let translateX = isHorizontal ? params.stretch * (offsetMultiplier) : 0;

          // Fix for ultra small values
          if (Math.abs(translateX) < 0.001) { translateX = 0; }
          if (Math.abs(translateY) < 0.001) { translateY = 0; }
          if (Math.abs(translateZ) < 0.001) { translateZ = 0; }
          if (Math.abs(rotateY) < 0.001) { rotateY = 0; }
          if (Math.abs(rotateX) < 0.001) { rotateX = 0; }

          // tslint:disable-next-line: max-line-length
          const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

          $slideEl.transform(slideTransform);
          $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
          if (params.slideShadows) {
            // Set shadows
            let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if ($shadowBeforeEl.length === 0) {
              $shadowBeforeEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
              $slideEl.append($shadowBeforeEl);
            }
            if ($shadowAfterEl.length === 0) {
              $shadowAfterEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
              $slideEl.append($shadowAfterEl);
            }
            if ($shadowBeforeEl.length) { $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0; }
            if ($shadowAfterEl.length) { $shadowAfterEl[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0; }
          }
        }

        // Set correct perspective for IE10
        if (swiper.support.pointerEvents || swiper.support.prefixedPointerEvents) {
          const ws = $wrapperEl[0].style;
          ws.perspectiveOrigin = `${center}px 50%`;
        }
      },
      setTransition(duration) {
        const swiper = this;
        swiper.slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
      }
    }
  };

  // CGPA
  cgpaChart: any;
  cgpaPerIntake$: Observable<CgpaPerIntake>;
  barChartData: any;
  overallCgpa = 0;
  cgpaCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: false,
    cardTitle: 'CGPA Per Intake',
    contentPadding: true
  };

  constructor(
    private ws: WsApiService,
    private studentTimetableService: StudentTimetableService,
    private userSettings: UserSettingsService,
    private navCtrl: NavController,
    private dragulaService: DragulaService,
    private notificationService: NotificationService,
    private renderer: Renderer2,
    private news: NewsService,
    private modalCtrl: ModalController
  ) {
    // Create the dragula group (drag and drop)
    this.dragulaService.createGroup('editable-list', {
      moves: (el, container, handle) => {
        return handle.classList.contains('handle');
      }
    });
    // getting the main accent color to color the chart.js (Temp until removing chart.js)
    this.activeAccentColor = this.userSettings.getAccentColorRgbaValue();
  }

  ngOnInit() {
    this.userSettings.getShownDashboardSections().subscribe(
      {
        next: data => this.shownDashboardSections = data,
      }
    );
    this.userSettings.getBusShuttleServiceSettings().subscribe(
      {
        next: data => {
          this.firstLocation = data.firstLocation;
          this.secondLocation = data.secondLocation;
          this.upcomingTrips$ = this.getUpcomingTrips(data.firstLocation, data.secondLocation);
        },
      }
    );
    this.userSettings.subscribeToCacheClear().subscribe(
      {
        // tslint:disable-next-line: no-trailing-whitespace
        next: data => data ? this.doRefresh() : ''
      }
    );
    this.doRefresh();
  }

  ngAfterViewInit() {
    this.shownDashboardSections.forEach(dragElementId => { // render the elements into the view based on the order in local storage
      this.renderer.appendChild(this.container.nativeElement, document.getElementById(dragElementId));
    });
  }

  ngOnDestroy() {
    // Destroy the edit list when page is destroyed
    this.dragulaService.destroy('editable-list');
  }

  doRefresh(refresher?) {
    this.getLocations(refresher);
    this.news$ = this.news.get(Boolean(refresher)).pipe(
      map(res => res.slice(0, 4)),
      finalize(() => refresher && refresher.target.complete()),
    );
    this.noticeBoardItems$ = this.news.getSlideshow(Boolean(refresher)).pipe(
      tap(res => console.log(res)),
      finalize(() => refresher && refresher.target.complete()),
    );
    this.upcomingTrips$ = this.getUpcomingTrips(this.firstLocation, this.secondLocation);
    this.photo$ = this.ws.get<StudentPhoto>('/student/photo', true);  // no-cache for student photo
    this.displayGreetingMessage();
    this.apcardTransaction$ = this.getTransactions(true); // no-cache for APCard transactions
    this.getBadge();
    forkJoin([
      this.getProfile(refresher),
      this.financial$ = this.getOverdueFee(true)
    ]).pipe(
      finalize(() => refresher && refresher.target.complete()),
    ).subscribe();
  }

  // NOTIFICATIONS FUNCTIONS
  getBadge() {
    this.notificationService.getMessages().subscribe(res => {
      this.numberOfUnreadMsgs = +res.num_of_unread_messages;
    });
  }

  // DRAG AND DROP FUNCTIONS (DASHBOARD CUSTOMIZATION)
  toggleReorderingMode() { // enable/disable edit mode
    if (this.editableList === 'editable-list') {
      this.editableList = null;
      this.saveArrayOrderInLocalStorage();
    } else {
      this.editableList = 'editable-list';
      this.dragulaModelArray = this.shownDashboardSections; // set the dragula modal array to the same value coming from local storage
    }

    // PREVENT SCROLLING ON MOBILE PHONES WHEN MOVING CARDS
    const handles = document.querySelectorAll('.handle');
    /* handle scroll */
    handles.forEach(element => {
      element.addEventListener('touchmove', event => event.preventDefault());
    });
  }

  removeSectionFromDashboard(sectionName: string) {
    const index = this.shownDashboardSections.indexOf(sectionName);
    if (index > -1) {
      this.shownDashboardSections.splice(index, 1);
    }
  }

  openDashboardSectionsSelectBox() {
    this.dashboardSectionsselectBoxRef.open();
  }

  dashboardSectionsChanged(event) {
    event.detail.value.forEach(section => {
      this.shownDashboardSections.splice(0, 0, section);
    });
  }

  saveArrayOrderInLocalStorage() {
    // Store data in local storage
    const itemsToStore = [];
    this.dragulaModelArray.forEach(arrayEl => {
      this.shownDashboardSections.forEach(shownDashboardSection => {
        if (arrayEl === shownDashboardSection) {
          itemsToStore.push(arrayEl);
        }
      });
    });
    this.userSettings.setShownDashboardSections(itemsToStore);
  }


  // PROFILE AND GREETING MESSAGE FUNCTIONS
  getProfile(refresher: boolean) {
    return this.ws.get<StudentProfile>('/student/profile', refresher).pipe(
      tap(studentProfile => {
        if (studentProfile.BLOCK === true) {
          this.block = false;
          this.cgpaPerIntake$ = this.getCgpaPerIntakeData(true); // no-cache for results
        } else {
          this.block = true;
        }
      }),
      tap(studentProfile => this.defaultIntake = studentProfile.INTAKE),
      tap(studentProfile => this.studentFirstName$ = of(studentProfile.NAME.split(' ')[0])),
      tap(studentProfile => this.getTodaysSchdule(studentProfile.INTAKE, refresher)), // INTAKE NEEDED FOR TIMETABLE
      tap(studentProfile => this.getUpcomingEvents(studentProfile.INTAKE, refresher)), // INTAKE NEEDED FOR EXAMS
      tap(studentProfile => this.getAttendance(studentProfile.INTAKE, true)), // no-cache for attendance
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

  // NEWS
  showMore(itemIndex: number) {
    this.newsIndexToShow = itemIndex;
  }

  async openNewsModal(item: News) {
    const modal = await this.modalCtrl.create({
      component: NewsModalPage,
      componentProps: { item, notFound: 'No news Selected' },
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  // TODAYS SCHEDULE FUNCTIONS
  getTodaysSchdule(intake: string, refresher: boolean) {
    // MERGE TWO OBSERVABLES TOGETHER (UPCOMING CONSULTATIONS AND UPCOMING CLASSES)
    this.todaysSchedule$ = combineLatest([
      this.getUpcomingClasses(intake, refresher),
      this.getUpcomingConsultations(true) // no-cache for upcoming consultations (students)
    ]).pipe(
      map(x => x[0].concat(x[1])), // MERGE THE TWO ARRAYS TOGETHER
      map(eventsList => {  // SORT THE EVENTS LIST BY TIME
        return eventsList.sort((eventA, eventB) => {
          return moment(eventA.dateOrTime, 'HH:mm A').toDate() > moment(eventB.dateOrTime, 'HH:mm A').toDate()
            ? 1
            : moment(eventA.dateOrTime, 'HH:mm A').toDate() < moment(eventB.dateOrTime, 'HH:mm A').toDate()
              ? -1
              : 0;
        });
      })
    );
  }

  // SLIDER
  prevSlide() {
    this.slides.slidePrev();
  }

  nextSlide() {
    this.slides.slideNext();
  }

  getUpcomingClasses(intake: string, refresher): Observable<EventComponentConfigurations[]> {
    const dateNow = new Date();
    return combineLatest([
      this.studentTimetableService.get(refresher),
      this.userSettings.timetable.asObservable()
    ]).pipe(

      // FILTER BLACKLISTED TIMETABLE
      map(([timetables, { blacklists }]) => blacklists
        ? timetables.filter(timetable => !blacklists.includes(timetable.MODID))
        : timetables),

      // FILTER THE LIST OF TIMETABLES TO GET THE TIMETABLE FOR THE SELECTED INTAKE ONLY
      map(timetables => timetables.filter(timetable => timetable.INTAKE === intake)),

      // GET TODAYS CLASSES ONLY
      map(intakeTimetable => intakeTimetable.filter(timetable => this.eventIsToday(new Date(timetable.DATESTAMP_ISO), dateNow))),

      // CONVERT TIMETABLE OBJECT TO THE OBJECT EXPECTED IN THE EVENT COMPONENET
      map((timetables: StudentTimetable[]) => {
        const timetableEventMode: EventComponentConfigurations[] = [];
        timetables.forEach((timetable: StudentTimetable) => {
          const secondsDiff = this.getSecondsDifferenceBetweenTwoDates(
            moment(timetable.TIME_FROM, 'HH:mm A').toDate(),
            moment(timetable.TIME_TO, 'HH:mm A').toDate());
          let classPass = false;
          if (this.eventPass(timetable.TIME_FROM, dateNow)) { // CHANGE CLASS STATUS TO PASS IF IT PASS
            classPass = true;
          }
          timetableEventMode.push({
            title: timetable.MODID,
            firstDescription: timetable.LOCATION + ' | ' + timetable.ROOM,
            secondDescription: timetable.NAME,
            thirdDescription: this.secondsToHrsAndMins(secondsDiff),
            color: '#27ae60',
            pass: classPass,
            passColor: '#d7dee3',
            outputFormat: 'event-with-time-and-hyperlink',
            type: 'class',
            dateOrTime: moment(moment(timetable.TIME_FROM, 'HH:mm A').toDate()).format('hh mm A'), // EXPECTED FORMAT HH MM A
          });
        });
        return timetableEventMode;
      })
    );
  }

  getUpcomingConsultations(refresher): Observable<EventComponentConfigurations[]> {
    const dateNow = new Date();
    const consultationsEventMode: EventComponentConfigurations[] = [];
    return this.ws.get<ConsultationHour[]>('/iconsult/upcomingconstu', refresher).pipe(
      map(consultations =>
        consultations.filter(
          consultation => this.eventIsToday(new Date(consultation.date), dateNow) && consultation.status === 'normal'
        )
      ),
      map(upcomingConsultations => {
        upcomingConsultations.forEach(upcomingConsultation => {
          let consultationPass = false;
          if (this.eventPass(upcomingConsultation.starttime, dateNow)) { // CHANGE CLASS STATUS TO PASS IF IT PASS
            consultationPass = true;
          }
          const secondsDiff = this.getSecondsDifferenceBetweenTwoDates(
            moment(upcomingConsultation.starttime, 'HH:mm A').toDate(),
            moment(upcomingConsultation.endtime, 'HH:mm A').toDate());
          consultationsEventMode.push({
            title: 'Consultation Hour',
            color: '#d35400',
            outputFormat: 'event-with-time-and-hyperlink',
            type: 'iconsult',
            pass: consultationPass,
            passColor: '#d7dee3',
            firstDescription: upcomingConsultation.location + ' | ' + upcomingConsultation.venue,
            secondDescription: upcomingConsultation.lecname,
            thirdDescription: this.secondsToHrsAndMins(secondsDiff),
            dateOrTime: moment(moment(upcomingConsultation.starttime, 'HH:mm A').toDate()).format('hh mm A'),
          });
        });
        return consultationsEventMode;
      })
    );
  }

  eventIsToday(eventDate: Date, todaysDate: Date) {
    return eventDate.getFullYear() === todaysDate.getFullYear()
      && eventDate.getMonth() === todaysDate.getMonth()
      && eventDate.getDate() === todaysDate.getDate();
  }

  eventIsComing(eventDate: Date, todaysDate: Date) {
    eventDate.setHours(todaysDate.getHours()); // MAKE THE EVENT TIME EQUAL TO TODAYS TIME TO COMPARE ONLY DATES
    eventDate.setMinutes(todaysDate.getMinutes());
    eventDate.setSeconds(todaysDate.getSeconds());
    eventDate.setMilliseconds(todaysDate.getMilliseconds());
    return eventDate > todaysDate;
  }

  eventPass(eventTime: string, todaysDate: Date) {
    if (moment(eventTime, 'HH:mm A').toDate() >= todaysDate) {
      return false;
    }
    return true;
  }


  // UPCOMING EVENTS FUNCTIONS
  getUpcomingEvents(intake: string, refresher: boolean) {
    const todaysDate = new Date();
    this.upcomingEvent$ = zip(
      this.getupcomingExams(intake, todaysDate, true),
      this.getUpcomingHoliday(todaysDate, refresher)
    ).pipe(
      map(x => x[0].concat(x[1])), // MERGE THE TWO ARRAYS TOGETHER
    );
  }

  getupcomingExams(intake: string, todaysDate: Date, refresher: boolean): Observable<EventComponentConfigurations[]> {
    const opt = { auth: false };
    return this.ws.get<ExamSchedule[]>(
      `/examination/${intake}`,
      refresher,
      opt,
    ).pipe(
      map(examsList => {
        return examsList.filter(exam => this.eventIsComing(new Date(exam.since), todaysDate));
      }),
      map(examsList => {
        const examsListEventMode: EventComponentConfigurations[] = [];
        examsList.forEach((exam: ExamSchedule) => {
          const secondsDiff = this.getSecondsDifferenceBetweenTwoDates(new Date(exam.since), new Date(exam.until));
          const formattedStartDate = moment(new Date(exam.since)).format('DD MMM YYYY');
          examsListEventMode.push({
            title: exam.subjectDescription,
            firstDescription: exam.venue,
            secondDescription: moment(new Date(exam.since)).format('HH:mm A'),
            thirdDescription: this.secondsToHrsAndMins(secondsDiff),
            color: '#ff0000',
            pass: false,
            passColor: '#d7dee3',
            outputFormat: 'event-with-date-only',
            type: 'exam',
            dateOrTime: formattedStartDate
          });
        });
        return examsListEventMode;
      })
    );
  }

  getUpcomingHoliday(date: Date, refresher: boolean): Observable<EventComponentConfigurations[]> {
    return this.ws.get<Holidays>('/transix/holidays/filtered/students', refresher, { auth: false }).pipe(
      map(res => res.holidays.find(h => date < new Date(h.holiday_start_date)) || {} as Holiday),
      map(holiday => {
        const examsListEventMode: EventComponentConfigurations[] = [];
        const formattedStartDate = moment(holiday.holiday_start_date, 'YYYY-MM-DD').format('DD MMM YYYY');
        examsListEventMode.push({
          title: holiday.holiday_name,
          firstDescription: 'Until: ' + holiday.holiday_end_date,
          thirdDescription: this.getNumberOfDaysForHoliday(
            moment(holiday.holiday_start_date, 'YYYY-MM-DD').toDate(),
            moment(holiday.holiday_end_date, 'YYYY-MM-DD').toDate()),
          color: '#273160',
          pass: false,
          passColor: '#d7dee3',
          outputFormat: 'event-with-date-only',
          type: 'holiday',
          dateOrTime: formattedStartDate
        });
        return examsListEventMode;
      })
    );
  }

  getNumberOfDaysForHoliday(startDate: Date, endDate: Date): string {
    const secondsDiff = this.getSecondsDifferenceBetweenTwoDates(startDate, endDate);
    const daysDiff = Math.floor(secondsDiff / (3600 * 24));
    return (daysDiff + 1) + ' day' + (daysDiff === 0 ? '' : 's');
  }

  // ATTENDANCE FUNCTIONS
  getAttendance(intake: string, refresher: boolean) {
    const url = `/student/attendance?intake=${intake}`;
    this.modulesWithLowAttendance$ = this.ws.get<Attendance[]>(url, refresher).pipe(
      tap(attendanceData => {
        // GETTING THE OVERALL ATTENDANCE VALUE FOR QUICK ACCESS ITEM
        if (attendanceData.length > 0) {
          const totalClasses = attendanceData.reduce((a, b) => a + b.TOTAL_CLASSES, 0);
          const totalAbsentClasses = attendanceData.reduce((a, b) => a + b.TOTAL_ABSENT, 0);
          const totalAttendedClasses = totalClasses - totalAbsentClasses;

          this.overallAttendancePercent$ = of({ value: totalAttendedClasses / totalClasses * 100 });
        } else {
          this.overallAttendancePercent$ = of({ value: -1 }); // -1 means there is no attendance data in the selected intake
        }
      }),
      // NEED TO THROUGH ERROR
      map(attendanceData => {
        const currentSemester = Math.max(
          ...attendanceData.map(attendance => attendance.SEMESTER),
        );
        return (attendanceData || []).filter(
          attendance =>
            attendance.SEMESTER === currentSemester &&
            attendance.PERCENTAGE < 80,
        );
      }),
      tap(
        attendanceData =>
          (this.subject = attendanceData[0] && attendanceData[0].SUBJECT_CODE),
      ),
      tap(modulesWithLowAttendance => {
        this.lowAttendanceChart = {
          type: 'horizontalBar',
          options: {
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
                  fontColor: 'rgba(' + this.activeAccentColor + ', 1)',
                  fontStyle: 900,
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
          },
          data: {
            datasets: [
              {
                backgroundColor: 'rgba(98, 98, 98, 0.3)',
                hoverBackgroundColor: 'rgba(' + this.activeAccentColor + ', 0.3)',
                borderColor: '#636363',
                borderWidth: 2,
                hoverBorderColor: 'rgba(' + this.activeAccentColor + ', 1)',
                hoverBorderWidth: 2,
                data: [],
              },
            ],
            labels: []
          }
        };
        modulesWithLowAttendance.forEach(module => {
          this.lowAttendanceChart.data.labels.push(module.MODULE_ATTENDANCE);
          this.lowAttendanceChart.data.datasets[0].data.push(module.PERCENTAGE);
        });
      }
      ),
      share(),
    );
  }

  // APCARD FUNCTIONS
  getTransactions(refresher) {
    return this.ws.get<Apcard[]>('/apcard/', refresher).pipe(
      map(transactions => this.signTransactions(transactions)),
      tap(transactions => this.analyzeTransactions(transactions)),
      tap(transactions => this.getCurrentApcardBalance(transactions))
    );
  }

  getCurrentApcardBalance(transactions) {
    if (transactions.length > 0) {
      this.balance$ = of({ value: transactions[0].Balance });
    } else {
      this.balance$ = of({ value: -1 });
    }
  }

  analyzeTransactions(transactions: Apcard[]) {
    // stop analyzing if transactions is empty
    if (transactions.length === 0) {
      this.currentBalance = -1;
      return;
    }
    this.currentBalance = transactions[0].Balance;

    const now = new Date();
    const a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.monthlyData = transactions.reduce(
      (tt, t) => {
        const c = t.SpendVal < 0 ? 'dr' : 'cr'; // classify spent type
        const d = new Date(t.SpendDate);
        if (!(d.getFullYear() in tt[c])) {
          (tt[c][d.getFullYear()] = a.slice());
        }
        tt[c][d.getFullYear()][d.getMonth()] += t.SpendVal;
        return tt;
        // default array with current year
      },
      {
        dr: { [now.getFullYear()]: a.slice() },
        cr: { [now.getFullYear()]: a.slice() }
      }
    );
    // plot graph
    this.apcardChart.data.datasets[0].data = this.monthlyData.cr[now.getFullYear()];
    this.apcardChart.data.datasets[1].data = this.monthlyData.dr[now.getFullYear()];
  }

  signTransactions(transactions: Apcard[]): Apcard[] {
    transactions.forEach(transaction => {
      if (transaction.ItemName !== 'Top Up') {
        // always make it negative (mutates cached value)
        transaction.SpendVal = -Math.abs(transaction.SpendVal);
      }
    });
    return transactions;
  }

  // FINANCIALS FUNCTIONS
  getOverdueFee(refresher: boolean): Observable<FeesTotalSummary | any> {
    return this.ws.get<FeesTotalSummary[]>(
      '/student/summary_overall_fee',
      refresher
    ).pipe(
      tap((overdueSummary) => {
        // GET THE VALUE OF THE TOTAL OVERALL USED IN THE QUICK ACCESS ITEM
        this.totalOverdue$ = of({ value: overdueSummary[0].TOTAL_OVERDUE });
      }),
      tap((overdueSummary) => {
        // Basically checking the Student's financial data to identify if there's any outstanding
        // tslint:disable-next-line: max-line-length
        if (overdueSummary[0].FINE !== 0 || overdueSummary[0].TOTAL_PAID !== overdueSummary[0].TOTAL_PAYABLE || overdueSummary[0].TOTAL_OUTSTANDING !== 0 || overdueSummary[0].TOTAL_OVERDUE !== 0) {
          this.hasOutstanding = true;
        } else {
          this.hasOutstanding = false;
        }
      }),
      tap(overdueSummary => {
        this.financialsChart.data = {
          labels: ['Financial Status'],
          datasets: [
            {
              label: 'Paid',
              data: [+overdueSummary[0].TOTAL_PAID],
              backgroundColor: 'rgb(73, 181, 113, .7)' // GREEN
            },
            {
              label: 'Outstanding',
              data: [+overdueSummary[0].TOTAL_OUTSTANDING],
              backgroundColor: 'rgba(241, 196, 15, .8)' // YELLOW
            },
            {
              label: 'Overdue',
              data: [+overdueSummary[0].TOTAL_OVERDUE],
              backgroundColor: 'rgb(224, 20, 57, .7)' // RED
            }
          ]
        };
      }),
      catchError(err => {
        this.totalOverdue$ = of({ value: -1 });
        return err;
      })
    );
  }

  // CGPA FUNCTIONS
  getCgpaPerIntakeData(refresher: boolean): Observable<CgpaPerIntake | any> {
    return this.ws
      .get<Course[]>('/student/courses', refresher)
      .pipe(
        flatMap(intakes => intakes),
        concatMap(intake => {
          const url = `/student/sub_and_course_details?intake=${
            intake.INTAKE_CODE
            }`;
          return this.ws.get<CourseDetails>(url, refresher).pipe(
            map(intakeDetails =>
              Object.assign({
                intakeDate: intake.INTAKE_NUMBER,
                intakeCode: intake.INTAKE_CODE,
                intakeDetails,
              }),
            ),
          );
        }),
        toArray(),
        tap(
          d => {
            const data = Array.from(
              new Set(
                (d || []).map(t => ({
                  intakeCode: t.intakeCode,
                  gpa: t.intakeDetails,
                })),
              ),
            );
            const filteredData = data.reverse().filter((res: any) => res.gpa[res.gpa.length - 2]).reverse();
            const labels = filteredData.map((i: any) => i.intakeCode);
            const gpa = filteredData.map((i: any) => i.gpa[i.gpa.length - 2].IMMIGRATION_GPA);
            gpa.forEach(intakeGpa => {
              this.overallCgpa += +intakeGpa;
            });
            this.overallCgpa = this.overallCgpa / gpa.length;
            this.cgpaChart = {
              type: 'horizontalBar',
              options: {
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
                      fontColor: 'rgba(' + this.activeAccentColor + ', 1)',
                      fontStyle: 900,
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
              },
              data: {
                labels,
                datasets: [
                  {
                    backgroundColor: 'rgba(98, 98, 98, 0.3)',
                    hoverBackgroundColor: 'rgba(' + this.activeAccentColor + ', .3)',
                    borderColor: '#636363',
                    borderWidth: 2,
                    hoverBorderColor: 'rgba(' + this.activeAccentColor + ', 1)',
                    hoverBorderWidth: 2,
                    data: gpa,
                  },
                ],
              }
            };
          }
        ),
        catchError(err => {
          console.log(err);
          return of();
        }
        )
      );
  }

  // UPCOMING TRIPS FUNCTIONS
  getUpcomingTrips(firstLocation: string, secondLocation: string): any {
    if (!firstLocation || !secondLocation) {
      this.showSetLocationsSettings = true;
      return of({});
    }
    this.showSetLocationsSettings = false;
    const dateNow = new Date();
    return this.ws.get<BusTrips>(`/transix/trips/applicable`, true, { auth: false }).pipe(
      map(res => res.trips),
      map(trips => { // FILTER TRIPS TO UPCOMING ONLY FROM THE SELCETED LOCATIONS
        return trips.filter(trip => {
          return moment(trip.trip_time, 'kk:mm').toDate() >= dateNow
            && trip.trip_day === this.getTodayDay(dateNow)
            && ((trip.trip_from === firstLocation && trip.trip_to === secondLocation)
              || (trip.trip_from === secondLocation && trip.trip_to === firstLocation));
        });
      }),
      map(trips => { // GET THE NEEDED DATA ONLY
        return trips.reduce(
          (prev, curr) => {
            prev[curr.trip_from + curr.trip_to] = prev[curr.trip_from + curr.trip_to] || {
              trip_from: curr.trip_from_display_name,
              trip_from_color: this.getLocationColor(curr.trip_from),
              trip_to: curr.trip_to_display_name,
              trip_to_color: this.getLocationColor(curr.trip_to),
              times: []
            };
            prev[curr.trip_from + curr.trip_to].times.push(curr.trip_time);
            return prev;
          },
          {}
        );
      }),
      map(trips => { // CONVERT OBJECT TO ARRAY
        return Object.keys(trips).map(
          key => trips[key]
        );
      })
    );
  }

  getLocations(refresher: boolean) {
    this.ws.get<APULocations>(`/transix/locations`, refresher, { auth: false }).pipe(
      map((res: APULocations) => res.locations),
      tap(locations => this.locations = locations)
    ).subscribe();
  }

  getLocationColor(locationName: string) {
    for (const location of this.locations) {
      if (location.location_name === locationName) {
        return location.location_color;
      }
    }
  }

  // GENERAL FUNCTIONS
  getSecondsDifferenceBetweenTwoDates(startDate: Date, endDate: Date): number {
    // PARAMETERS MUST BE STRING. FORMAT IS ('HH:mm A')
    // RETURN TYPE IS STRING. FORMAT: 'HH hrs mm min'
    return (endDate.getTime() - startDate.getTime()) / 1000;
  }

  secondsToHrsAndMins(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor(seconds % 3600 / 60);
    return hours + ' hr' + (hours > 1 ? 's' : '') + ' ' + mins + ' min' + (mins > 1 ? 's' : '');
  }

  navigateToPage(pageName: string) {
    this.navCtrl.navigateForward(pageName);
  }

  // GET DAY SHORT NAME (LIKE 'SAT' FOR SATURDAY)
  getTodayDay(date: Date) {
    const dayRank = date.getDay();
    if (dayRank === 0) {
      return 'sun';
    } else if (dayRank > 0 && dayRank <= 5) {
      return 'mon-fri';
    } else {
      return 'sat';
    }
  }
}
