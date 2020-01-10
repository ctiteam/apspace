import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IonSelect, IonSlides, ModalController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { DragulaService } from 'ng2-dragula';
import { Observable, of, zip } from 'rxjs';
import { finalize, map, shareReplay, switchMap, tap } from 'rxjs/operators';
// tslint:disable-next-line: max-line-length
import { APULocation, APULocations, Apcard, BusTrips, ConsultationSlot, DashboardCardComponentConfigurations, EventComponentConfigurations, Holiday, Holidays, LecturerTimetable, News, Quote, StaffProfile } from 'src/app/interfaces';
import { FireworksSettings } from 'src/app/interfaces/fireworks-settings';
import { NewsService, NotificationService, UserSettingsService, WsApiService } from '../../services';
import { NewsModalPage } from '../news/news-modal';

@Component({
  selector: 'app-staff-dashboard',
  templateUrl: './staff-dashboard.page.html',
  styleUrls: ['./staff-dashboard.page.scss'],
})
export class StaffDashboardPage implements OnInit, AfterViewInit, OnDestroy {
  // Setting fireworks animation
  fireworksSettings: FireworksSettings = {
    message: '新年快乐',
    subMessage: 'Happy Chinese New Year',
    fontStyle: {
      color: 'lemonchiffon',
      textShadow: '0 0 10px orange, 0 0 10px darkorange',
      fontFamily: `'Ma Shan Zheng', cursive`,
      fontSize: '300%'
    },
    launchImageStyle: {
      launchImage: 'assets/img/lantern.png',
      top: '2%',
      left: '86%',
      width: '30px'
    },
    headerImage: 'assets/img/6325321.png',
    backgroundColor: '#192D46'
  };

  // USER SETTINGS
  @ViewChild('slides', { static: false }) slides: IonSlides;
  @ViewChild('dragulaContainer', { static: true }) container: ElementRef; // access the dragula container
  @ViewChild('dashboardSectionsSelectBox', { static: true }) dashboardSectionsselectBoxRef: IonSelect; // hidden selectbox
  dashboardSectionsSelectBoxModel; // select box dashboard sections value
  allDashboardSections = [ // alldashboardSections will not be modified and it will be used in the select box
    'inspirationalQuote',
    'todaysSchedule',
    'upcomingEvents',
    'news',
    'upcomingTrips',
    'apcard',
    'noticeBoard'
  ];

  // dragulaModelArray will be modified whenever there is a change to the order of the dashboard sections
  dragulaModelArray = this.allDashboardSections;
  // shownDashboardSections get the data from local storage and hide/show elements based on that
  shownDashboardSections: string[];

  activeAccentColor = '';
  editableList = null;
  busShuttleServiceSettings: any;
  secondLocation: string;
  firstLocation: string;
  staffProfile$: Observable<StaffProfile>;
  // ALERTS SLIDER OPTIONS
  alertSliderOptions = {
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    speed: 500,
  };

  // PROFILE
  greetingMessage = '';
  staffFirstName: string;
  numberOfUnreadMsgs: number;

  // TODAY'S SCHEDULE
  todaysSchedule$: Observable<EventComponentConfigurations[] | any>;
  todaysScheduleCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: false,
    cardTitle: 'Today\'s Schedule',
  };

  // NEWS
  news$: Observable<News[]>;
  newsCardConfigurations: DashboardCardComponentConfigurations = {
    cardTitle: 'Latest News',
    contentPadding: false,
    withOptionsButton: false
  };
  newsIndexToShow = 0; // open the first news section by default
  quote$: Observable<Quote>;
  noticeBoardCardConfigurations: DashboardCardComponentConfigurations = {
    cardTitle: 'Notice Board',
    contentPadding: false,
    withOptionsButton: false
  };
  noticeBoardItems$: Observable<any[]>;
  noticeBoardSliderOpts = {
    autoplay: true,
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.params = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { slides } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          let tx = -offset$$1;
          if (!swiper.params.virtualTranslate) { tx -= swiper.translate; }
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity = swiper.params.fadeEffect.crossFade
            ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
            : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl
            .css({
              opacity: slideOpacity,
            })
            .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          slides.transitionEnd(() => {
            if (eventTriggered) { return; }
            if (!swiper || swiper.destroyed) { return; }
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      },
    }
  };

  // HOLIDAYS
  holidays$: Observable<Holiday[]>;

  // TODAYS TRIPS
  upcomingTrips$: Observable<any>;
  showSetLocationsSettings = false;
  locations: APULocation[];
  busCardConfigurations: DashboardCardComponentConfigurations = {
    cardTitle: 'Upcoming Trips',
    contentPadding: false,
    withOptionsButton: false,
  };

  inspirationalQuotesCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: false,
    cardTitle: 'Inspirational Quotes',
    cardSubtitle: 'Get inspired by today\'s'
  };


  // UPCOMING EVENTS
  upcomingEvent$: Observable<EventComponentConfigurations[]>;
  upcomingEventsCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: false,
    cardTitle: 'Upcoming Events',
    cardSubtitle: 'Today: ' + moment().format('DD MMMM YYYY')
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

  testDate = [
    'Thu, 15 Aug 2019 08:00:00 GMT+0800',
    'Thu, 15 Aug 2019 08:00:00 GMT+0800',
    'Thu, 15 Aug 2019 08:00:00 GMT+0800',
    'Thu, 15 Aug 2019 08:00:00 GMT+0800',
    'Thu, 15 Aug 2019 08:00:00 GMT+0800'
  ];

  constructor(
    private ws: WsApiService,
    private userSettings: UserSettingsService,
    private navCtrl: NavController,
    private dragulaService: DragulaService,
    private notificationService: NotificationService,
    private renderer: Renderer2,
    private news: NewsService,
    private modalCtrl: ModalController,
  ) {
    this.activeAccentColor = this.userSettings.getAccentColorRgbaValue();
  }

  ngOnInit() {
    this.userSettings.getShownDashboardSections().subscribe(
      {
        next: data => this.shownDashboardSections = data,
      }
    );

    this.holidays$ = this.getHolidays(false);

    this.userSettings.getBusShuttleServiceSettings().subscribe(
      {
        next: data => {
          this.firstLocation = data.firstLocation;
          this.secondLocation = data.secondLocation;
          this.upcomingTrips$ = this.getUpcomingTrips(data.firstLocation, data.secondLocation, true);
        },
      }
    );
    this.userSettings.subscribeToCacheClear().subscribe(
      {
        // tslint:disable-next-line: no-trailing-whitespace
        next: data => data ? this.doRefresh() : ''
      }
    );

    this.enableCardReordering();
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
    this.displayGreetingMessage();
    this.getLocations(refresher);
    this.quote$ = this.ws.get<Quote>('/apspacequote', { auth: false });
    this.holidays$ = this.getHolidays(true);
    this.news$ = this.news.get(refresher).pipe(
      map(res => res.slice(0, 4))
    );
    this.noticeBoardItems$ = this.news.getSlideshow(refresher);
    this.upcomingTrips$ = this.getUpcomingTrips(this.firstLocation, this.secondLocation, refresher);
    this.getUpcomingEvents();
    this.apcardTransaction$ = this.getTransactions(true); // no-cache for apcard transactions
    this.getBadge();
    this.getProfile(refresher).pipe(
      finalize(() => refresher && refresher.target.complete()),
    ).subscribe();
  }

  // NOTIFICATIONS FUNCTIONS
  getBadge() {
    this.notificationService.getMessages().subscribe(res => {
      this.numberOfUnreadMsgs = +res.num_of_unread_messages;
    });
  }

  // GET DETAILS FOR HOLIDAYS
  // holidays$ REQUIRED FOR $upcomingTrips
  getHolidays(refresher: boolean): Observable<Holiday[]> {
    const caching = refresher ? 'network-or-cache' : 'cache-only';
    return this.ws.get<Holidays>('/transix/holidays/filtered/staff', { auth: false, caching }).pipe(
      map(res => res.holidays),
      // AUTO REFRESH IF HOLIDAY NOT FOUND
      switchMap(holidays => {
        const date = new Date();
        return refresher || holidays.find(h => date < new Date(h.holiday_start_date))
          ? of(holidays)
          : this.getHolidays(true);
      }),
      shareReplay(1),
    );
  }

  // DRAG AND DROP FUNCTIONS (DASHBOARD CUSTOMIZATION)
  toggleReorderingMode() {
    if (this.editableList === 'editable-list') {
      this.editableList = null;
      this.saveArrayOrderInLocalStorage();
    } else {
      this.editableList = 'editable-list';
      this.dragulaModelArray = this.shownDashboardSections; // set the dragula modal array to the same value coming from local storage
    }    // PREVENT SCROLLING ON MOBILE PHONES WHEN MOVING CARDS
    const handles = document.querySelectorAll('.handle');
    /* handle scroll */
    handles.forEach(element => {
      element.addEventListener('touchmove', event => event.preventDefault());
    });
  }

  enableCardReordering() {
    this.dragulaService.createGroup('editable-list', {
      moves: (_el, _container, handle) => {
        return handle.classList.contains('handle');
      }
    });
  }

  openDashboardSectionsSelectBox() {
    this.dashboardSectionsselectBoxRef.open();
  }

  dashboardSectionsChanged(event) {
    event.detail.value.forEach(section => {
      this.shownDashboardSections.splice(0, 0, section);
    });
  }

  removeSectionFromDashboard(sectionName: string) {
    const index = this.shownDashboardSections.indexOf(sectionName);
    if (index > -1) {
      this.shownDashboardSections.splice(index, 1);
    }
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
    const caching = refresher ? 'network-or-cache' : 'cache-only';
    return this.staffProfile$ = this.ws.get<StaffProfile>('/staff/profile', { caching }).pipe(
      tap(staffProfile => this.staffFirstName = staffProfile[0].FULLNAME.split(' ')[0]),
      tap(staffProfile => this.getTodaysSchdule(staffProfile[0].ID))
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

  // TODAYS SCHEDULE FUNCTIONS
  getTodaysSchdule(staffId: string) {
    this.todaysSchedule$ = zip( // ZIP TWO OBSERVABLES TOGETHER (UPCOMING CONSULTATIONS AND UPCOMING CLASSES)
      this.getUpcomingClasses(staffId),
      this.getUpcomingConsultations() // no-cache for upcoming consultations
    ).pipe(
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

  getUpcomingClasses(staffId: string): Observable<EventComponentConfigurations[]> {
    const d = new Date();
    const date = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
    // const endpoint = '/lecturer-timetable/v2/' + 'anrazali'; // For testing
    const endpoint = '/lecturer-timetable/v2/' + staffId;
    return this.ws.get<LecturerTimetable[]>(endpoint, { auth: false, caching: 'cache-only' }).pipe(
      // GET TODAYS CLASSES ONLY
      map(timetable => timetable.filter(tt => this.eventIsToday(new Date(tt.time), d))),
      // REFRESH LECTURER TIMETABLE ONLY IF NO CLASSES IN LECTURER TIMETABLE AND NOT A HOLIDAY
      switchMap(timetables => timetables.length !== 0
        ? of(timetables)
        : this.holidays$.pipe(
          // XXX: ONLY START DAY IS BEING MATCHED
          switchMap(holidays => holidays.find(holiday => date === holiday.holiday_start_date)
            ? of(timetables)
            : this.ws.get<LecturerTimetable[]>(endpoint, { auth: false, caching: 'network-or-cache' }).pipe(
              map(timetable => timetable.filter(tt => this.eventIsToday(new Date(tt.time), d))),
            )
          ),
        )
      ),
      // CONVERT TIMETABLE OBJECT TO THE OBJECT EXPECTED IN THE EVENT COMPONENT
      map((timetables: LecturerTimetable[]) => {
        const timetableEventMode: EventComponentConfigurations[] = [];

        timetables.forEach((timetable: LecturerTimetable) => {
          let classPass = false;
          if (this.eventPass(moment(timetable.time).format('HH:mm A'), d)) { // CHANGE CLASS STATUS TO PASS IF IT PASS
            classPass = true;
          }

          timetableEventMode.push({
            title: timetable.module,
            firstDescription: timetable.location + ' | ' + timetable.room,
            secondDescription: timetable.intakes.join(', '),
            thirdDescription: this.secondsToHrsAndMins(timetable.duration),
            color: '#27ae60',
            pass: classPass,
            passColor: '#d7dee3',
            outputFormat: 'event-with-time-and-hyperlink',
            type: 'class',
            dateOrTime: moment(moment(timetable.time).toDate()).format('hh mm A'), // EXPECTED FORMAT HH MM A
          });

        });

        return timetableEventMode;
      })
    );
  }

  getUpcomingConsultations(): Observable<EventComponentConfigurations[]> {
    const dateNow = new Date();
    const consultationsEventMode: EventComponentConfigurations[] = [];
    return this.ws.get<ConsultationSlot[]>('/iconsult/slots?').pipe(
      map(consultations =>
        consultations.filter(
          consultation => this.eventIsToday(new Date(moment(consultation.start_time).utcOffset('+0800').format()), dateNow)
            && consultation.status === 'Booked'
        )
      ),
      map(upcomingConsultations => {
        upcomingConsultations.forEach(upcomingConsultation => {
          let consultationPass = false;
          if (this.eventPass(moment(upcomingConsultation.start_time).utcOffset('+0800').format('hh:mm A'), dateNow)) {
            // CHANGE CLASS STATUS TO PASS IF IT PASS
            consultationPass = true;
          }
          const secondsDiff = this.getSecondsDifferenceBetweenTwoDates(
            moment(moment(upcomingConsultation.start_time).utcOffset('+0800').format('hh:mm A'), 'HH:mm A').toDate(),
            moment(moment(upcomingConsultation.end_time).utcOffset('+0800').format('hh:mm A'), 'HH:mm A').toDate());
          consultationsEventMode.push({
            title: 'Consultation Hour',
            color: '#d35400',
            outputFormat: 'event-with-time-and-hyperlink',
            type: 'iconsult',
            pass: consultationPass,
            passColor: '#d7dee3',
            firstDescription: upcomingConsultation.room_code + ' | ' + upcomingConsultation.venue,
            // secondDescription: upcomingConsultation.lecname,
            thirdDescription: this.secondsToHrsAndMins(secondsDiff),
            dateOrTime: moment(upcomingConsultation.start_time).utcOffset('+0800').format('hh mm A'),
          });
        });
        return consultationsEventMode;
      })
    );
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

  // SLIDER
  prevSlide() {
    this.slides.slidePrev();
  }

  nextSlide() {
    this.slides.slideNext();
  }

  // UPCOMING EVENTS FUNCTIONS
  getUpcomingEvents() {
    const todaysDate = new Date();
    this.upcomingEvent$ = this.getUpcomingHoliday(todaysDate);
  }

  getUpcomingHoliday(date: Date): Observable<EventComponentConfigurations[]> {
    return this.holidays$.pipe(
      map(holidays => {
        const holiday = holidays.find(h => date < new Date(h.holiday_start_date)) || {} as Holiday;

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

  // APCARD FUNCTIONS
  getTransactions(refresher: boolean) {
    const caching = refresher ? 'network-or-cache' : 'cache-only';
    return this.ws.get<Apcard[]>('/apcard/', { caching }).pipe(
      map(transactions => this.signTransactions(transactions)),
      tap(transactions => this.analyzeTransactions(transactions))
    );
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

  // UPCOMING TRIPS FUNCTIONS
  getUpcomingTrips(firstLocation: string, secondLocation: string, refresher: boolean): any {
    if (!firstLocation || !secondLocation) {
      this.showSetLocationsSettings = true;
      return of({});
    }
    this.showSetLocationsSettings = false;
    const dateNow = new Date();
    const caching = refresher ? 'network-or-cache' : 'cache-only';
    return this.ws.get<BusTrips>(`/transix/trips/applicable`, { auth: false, caching }).pipe(
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
      }),
    );
  }

  getLocations(refresher: boolean) {
    const caching = refresher ? 'network-or-cache' : 'cache-only';
    this.ws.get<APULocations>(`/transix/locations`, { auth: false, caching }).pipe(
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

  getNumberOfDaysForHoliday(startDate: Date, endDate: Date): string {
    const secondsDiff = this.getSecondsDifferenceBetweenTwoDates(startDate, endDate);
    const daysDiff = Math.floor(secondsDiff / (3600 * 24));
    return (daysDiff + 1) + ' day' + (daysDiff === 0 ? '' : 's');
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
