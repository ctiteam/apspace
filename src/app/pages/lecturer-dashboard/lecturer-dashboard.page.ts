import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  EventComponentConfigurations,
  DashboardCardComponentConfigurations,
  Apcard,
  StudentPhoto,
  StaffProfile,
  LecturerTimetable,
  APULocation,
  BusTrips,
  APULocations,
  Holidays,
  Holiday,
  ConsultationHour,
  LecturerConsultation
} from 'src/app/interfaces';

import { Observable, of, zip } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { WsApiService, UserSettingsService, NotificationService } from 'src/app/services';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-lecturer-dashboard',
  templateUrl: './lecturer-dashboard.page.html',
  styleUrls: ['./lecturer-dashboard.page.scss'],
})
export class LecturerDashboardPage implements OnInit, OnDestroy {
  // USER SETTINGS
  activeAccentColor = '';
  shownDashboardSections: string[];
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
  // photo$: Observable<StudentPhoto>;
  greetingMessage = '';
  staffFirstName: string;
  numberOfUnreadMsgs: number;

  // TODAY'S SCHEDULE
  todaysSchedule$: Observable<EventComponentConfigurations[] | any>;
  todaysScheduleCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: false,
    // options: [
    //   {
    //     title: 'set alarm before 15 minutes of next schdule',
    //     icon: 'alarm',
    //     callbackFunction: this.testCallBack
    //   },
    //   {
    //     title: 'delete',
    //     icon: 'trash',
    //     callbackFunction: this.testCallBack
    //   }
    // ],
    cardTitle: 'Today\'s Schedule',
    // cardSubtitle: 'Next in: 1 hrs, 25 min'
  };

  // TODAYS TRIPS
  upcomingTrips$: Observable<any>;
  showSetLocationsSettings = false;
  locations: APULocation[];
  busCardConfigurations: DashboardCardComponentConfigurations = {
    cardTitle: 'Upcoming Trips',
    contentPadding: false,
    withOptionsButton: false,
    // options: [
    //   {
    //     title: 'set alarm before 15 minutes of next schdule',
    //     icon: 'alarm',
    //     callbackFunction: this.testCallBack
    //   },
    //   {
    //     title: 'delete',
    //     icon: 'trash',
    //     callbackFunction: this.testCallBack
    //   }
    // ],
  };

  // UPCOMING EVENTS
  upcomingEvent$: Observable<EventComponentConfigurations[]> | any;
  upcomingEventsCardConfigurations: DashboardCardComponentConfigurations = {
    withOptionsButton: false,
    // options: [
    //   {
    //     title: 'set alarm before 15 minutes of next schdule',
    //     icon: 'alarm',
    //     callbackFunction: this.testCallBack
    //   },
    //   {
    //     title: 'delete',
    //     icon: 'trash',
    //     callbackFunction: this.testCallBack
    //   }
    // ],
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

  constructor(
    private ws: WsApiService,
    private userSettings: UserSettingsService,
    private navCtrl: NavController,
    private dragulaService: DragulaService,
    private notificationService: NotificationService
  ) {
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

  ngOnDestroy() {
    // Destroy the edit list when page is destroyed
    this.dragulaService.destroy('editable-list');
  }

  doRefresh(refresher?) {
    this.displayGreetingMessage();
    this.getLocations(refresher);
    this.upcomingTrips$ = this.getUpcomingTrips(this.firstLocation, this.secondLocation, refresher);
    this.getUpcomingEvents(refresher);
    this.apcardTransaction$ = this.getTransactions(refresher);
    this.getBadge();
    this.getProfile(refresher).subscribe();
  }

  // NOTIFICATIONS FUNCTIONS
  getBadge() {
    this.notificationService.getMessages().subscribe(res => {
      this.numberOfUnreadMsgs = +res.num_of_unread_msgs;
    });
  }

  // DRAG AND DROP FUNCTIONS (DASHBOARD CUSTOMIZATION)
  toggleReorderingMode() {
    this.editableList === 'editable-list' ? this.editableList = null : this.editableList = 'editable-list';
    // PREVENT SCROLLING ON MOBILE PHONES WHEN MOVING CARDS
    const handles = document.querySelectorAll('.handle');
    /* handle scroll */
    handles.forEach(element => {
      element.addEventListener('touchmove', event => event.preventDefault());
    });
  }

  enableCardReordering() {
    this.dragulaService.createGroup('editable-list', {
      moves: (el, container, handle) => {
        return handle.classList.contains('handle');
      }
    });
  }

  // PROFILE AND GREETING MESSAGE FUNCTIONS
  getProfile(refresher: boolean) {
    return this.staffProfile$ = this.ws.get<StaffProfile>('/staff/profile', refresher).pipe(
      tap(p => console.log(p)),
      tap(staffProfile => this.staffFirstName = staffProfile[0].FULLNAME.split(' ')[0]),
      tap(staffProfile => this.getTodaysSchdule(staffProfile[0].ID, refresher))
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
  getTodaysSchdule(staffId: string, refresher) {
    this.todaysSchedule$ = zip( // ZIP TWO OBSERVABLES TOGETHER (UPCOMING CONSULTATIONS AND UPCOMING CLASSES)
      this.getUpcomingClasses(staffId, refresher),
      this.getUpcomingConsultations(refresher)
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

  getUpcomingClasses(staffId: string, refresher: boolean): Observable<EventComponentConfigurations[]> {
    const dateNow = new Date();
    // const endpoint = '/lecturer-timetable/v2/' + 'anrazali'; // For testing
    const endpoint = '/lecturer-timetable/v2/' + staffId;
    return this.ws.get<LecturerTimetable[]>(endpoint, refresher, { auth: false }).pipe(
      // GET TODAYS CLASSES ONLY
      map(timetable => timetable.filter(tt => this.eventIsToday(new Date(tt.time), dateNow))),

      // CONVERT TIMETABLE OBJECT TO THE OBJECT EXPECTED IN THE EVENT COMPONENT
      map((timetables: LecturerTimetable[]) => {
        const timetableEventMode: EventComponentConfigurations[] = [];

        timetables.forEach((timetable: LecturerTimetable) => {
          let classPass = false;
          if (this.eventPass(timetable.time, dateNow)) { // CHANGE CLASS STATUS TO PASS IF IT PASS
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

  getUpcomingConsultations(refresher): Observable<EventComponentConfigurations[]> {
    const dateNow = new Date();
    const consultationsEventMode: EventComponentConfigurations[] = [];
    return this.ws.get<LecturerConsultation[]>('/iconsult/upcomingconlec', refresher).pipe(
      map(consultations =>
        consultations.filter(
          consultation => this.eventIsToday(new Date(consultation.date), dateNow) && consultation.status === 'Booked'
        )
      ),
      map(upcomingConsultations => {
        upcomingConsultations.forEach(upcomingConsultation => {
          let consultationPass = false;
          if (this.eventPass(upcomingConsultation.time, dateNow)) { // CHANGE CLASS STATUS TO PASS IF IT PASS
            consultationPass = true;
          }
          const secondsDiff = this.getSecondsDifferenceBetweenTwoDates(
            moment(upcomingConsultation.time, 'HH:mm A').toDate(),
            moment(upcomingConsultation.endTime, 'HH:mm A').toDate());
          consultationsEventMode.push({
            title: 'Consultation Hour',
            color: '#d35400',
            outputFormat: 'event-with-time-and-hyperlink',
            type: 'iconsult',
            pass: consultationPass,
            passColor: '#d7dee3',
            firstDescription: upcomingConsultation.location + ' | ' + upcomingConsultation.venue,
            // secondDescription: upcomingConsultation.lecname,
            thirdDescription: this.secondsToHrsAndMins(secondsDiff),
            dateOrTime: moment(moment(upcomingConsultation.time, 'HH:mm A').toDate()).format('hh mm A'),
          });
        });
        return consultationsEventMode;
      })
    );
  }

  // UPCOMING EVENTS FUNCTIONS
  getUpcomingEvents(refresher: boolean) {
    const todaysDate = new Date();
    this.upcomingEvent$ = this.getUpcomingHoliday(todaysDate, refresher);
  }

  getUpcomingHoliday(date: Date, refresher): Observable<EventComponentConfigurations[]> {
    return this.ws.get<Holidays>('/transix/holidays/filtered/staff', refresher).pipe(
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

  // APCARD FUNCTIONS
  getTransactions(refresher: boolean) {
    return this.ws.get<Apcard[]>('/apcard/', refresher).pipe(
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
    return this.ws.get<BusTrips>(`/transix/trips/applicable`, refresher, { auth: false }).pipe(
      map(res => res.trips),
      map(trips => { // FILTER TRIPS TO UPCOMING ONLY FROM THE SELCETED LOCATIONS
        return trips.filter(trip => {
          return moment(trip.trip_time, 'kk:mm').toDate() >= dateNow
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
}
