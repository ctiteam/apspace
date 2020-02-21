import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import * as moment from 'moment';
import { Observable, forkJoin } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { APULocation, APULocations, BusTrip, BusTrips } from 'src/app/interfaces';
import { SettingsService, WsApiService } from 'src/app/services';

@Component({
  selector: 'app-bus-shuttle-services',
  templateUrl: './bus-shuttle-services.page.html',
  styleUrls: ['./bus-shuttle-services.page.scss'],
})
export class BusShuttleServicesPage {
  trip$: Observable<BusTrip[]>;
  filteredTrip$: any;
  locations: APULocation[];
  dateNow = new Date();
  timeNow = '';
  latestUpdate = '';

  filterObject: {
    tripDay: string,
    toLocation: string,
    fromLocation: string,
    show: 'all' | 'upcoming'
  } = {
      toLocation: '',
      fromLocation: '',
      show: 'all',
      tripDay: this.getTodayDay(this.dateNow)
    };

  skeletonSettings = {
    numberOfSkeltons: new Array(6),
    numberOfLocationsPerSource: new Array(3),
    numberOfTimesPerTrip: new Array(9)
  };

  numberOfTrips = 1;

  constructor(
    private menu: MenuController,
    private settings: SettingsService,
    private ws: WsApiService,
    private router: Router,
  ) { }

  ionViewDidEnter() {
    // GETTING FILTER SETTINGS FROM STORAGE:
    if (this.settings.get('tripFrom')) {
      this.filterObject.fromLocation = this.settings.get('tripFrom');
    }
    if (this.settings.get('tripTo')) {
      this.filterObject.toLocation = this.settings.get('tripTo');
    }
    this.doRefresh(false);
  }

  doRefresh(refresher) {
    // FORCE +08
    this.timeNow = moment(this.dateNow).utcOffset('+0800').format('kk:mm'); // update current time when user refresh
    this.filteredTrip$ = forkJoin([this.getLocations(refresher), this.getTrips(refresher)]).pipe(
      map(res => res[1]),
      tap(_ => this.onFilter(refresher)),
      finalize(() => refresher && refresher.target.complete()),
    );
  }

  getTrips(refresher: boolean) {
    const caching = refresher ? 'network-or-cache' : 'cache-only';
    return this.trip$ = this.ws.get<BusTrips>(`/transix/trips/applicable`, { auth: false, caching }).pipe(
      map(res => res.trips),
    );
  }

  getLocations(refresher: boolean) {
    const caching = refresher ? 'network-or-cache' : 'cache-only';
    return this.ws.get<APULocations>(`/transix/locations`, { auth: false, caching }).pipe(
      map((res: APULocations) => res.locations),
      tap(locations => this.locations = locations)
    );
  }

  onFilter(refresher = false) {
    if (refresher) { // clear the filter data if user refresh the page
      this.filterObject = {
        fromLocation: '',
        toLocation: '',
        tripDay: this.getTodayDay(this.dateNow),
        show: 'all'
      };
    }
    this.filteredTrip$ = this.trip$.pipe(
      map(trips => {
        this.numberOfTrips = 1; // HIDE 'THERE ARE NO TRIPS' MESSAGE
        let filteredArray = trips.filter(trip => {
          // FILTER TRIPS BY (FROM, TO) LOCATIONS, AND DAY
          if (this.filterObject.tripDay === 'mon-fri') {
            return (
              trip.trip_from.includes(this.filterObject.fromLocation) &&
              trip.trip_to.includes(this.filterObject.toLocation) &&
              (trip.trip_day === 'mon-fri' || trip.trip_day === 'fri')
            );
          } else {
            return (
              trip.trip_from.includes(this.filterObject.fromLocation) &&
              trip.trip_to.includes(this.filterObject.toLocation) &&
              trip.trip_day === this.filterObject.tripDay
            );
          }
        });
        if (this.filterObject.show === 'upcoming') {
          filteredArray = filteredArray.filter(trip => {
            // FILTER TRIPS TO UPCOMING TRIPS ONLY
            // return this.strToDate(trip.trip_time) >= this.dateNow;
            return moment(trip.trip_time, 'kk:mm').toDate() >= this.dateNow;
          });
        }
        if (filteredArray.length === 0) { // NO RESULTS => SHOW 'THERE ARE NO TRIPS' MESSAGE
          this.numberOfTrips = 0;
        }
        return filteredArray;
      }),
      tap(trips => {
        // STORE LATEST UPDATE DATE
        this.latestUpdate = moment(Math.max(...trips.map(trip =>
          moment(trip.applicable_from, 'YYYY-MM-DD').toDate().getTime())))
          .format('dddd, Do MMMM YYYY');
      }),
      map(trips => {
        const result = trips.reduce((r, a) => {
          r[a.trip_from] = r[a.trip_from] || {};  // {acadimea: , apu: ...}
          r[a.trip_from][a.trip_to] = r[a.trip_from][a.trip_to] || [];

          r[a.trip_from][a.trip_to].push(a);
          return r;
        }, {});

        return result;
      }),
      tap(_ => {
        this.settings.set('tripFrom', this.filterObject.fromLocation);
        this.settings.set('tripTo', this.filterObject.toLocation);
      })
    );
  }

  openMenu() {
    this.menu.enable(true, 'bus-filter-menu');
    this.menu.open('bus-filter-menu');
  }

  closeMenu() {
    this.menu.close('bus-filter-menu');
  }

  // SWAP FROM AND TO LOCATIONS
  swapLocations() {
    const temp = this.filterObject.toLocation;
    this.filterObject.toLocation = this.filterObject.fromLocation;
    this.filterObject.fromLocation = temp;
    this.onFilter();
  }

  clearFilter() {
    this.filterObject = {
      fromLocation: '',
      toLocation: '',
      tripDay: this.getTodayDay(this.dateNow),
      show: 'upcoming'
    };
    this.onFilter();
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

  // GET LOCATION NAME BY LOCATION ID
  getLocationDisplayNameAndType(locationName: string) {
    for (const location of this.locations) {
      if (location.location_name === locationName) {
        return location.location_nice_name + '&&' + location.location_type;
      }
    }
  }

  // GET LOCATION COLOR BY LOCATION ID
  getLocationColor(locationName: string) {
    for (const location of this.locations) {
      if (location.location_name === locationName) {
        return location.location_color;
      }
    }
  }

  comingFromTabs() {
    if (this.router.url.split('/')[1].split('/')[0] === 'tabs') {
      return true;
    }
    return false;
  }
}
