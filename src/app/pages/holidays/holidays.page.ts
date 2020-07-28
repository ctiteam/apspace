import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { format, parseISO } from 'date-fns';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { EventComponentConfigurations, Holiday, Holidays, Role } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.page.html',
  styleUrls: ['./holidays.page.scss'],
})
export class HolidaysPage implements OnInit {
  holiday$: Observable<Holiday[]>;
  filteredHoliday$: Observable<Holiday[] | EventComponentConfigurations[]>;

  numberOfHolidays = 1;

  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  todaysDate = new Date();
  filterObject: {
    show: 'all' | 'upcoming',
    filterDays: string,
    filterMonths: string,
    numberOfDays: '' | '1 days' | 'many',
    affecting: '' | 'students' | 'staff'
  };

  constructor(
    private ws: WsApiService,
    private menu: MenuController,
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.defaultFilter();
  }

  ionViewDidEnter() {
    this.doRefresh();
  }

  getHolidays(refresher: boolean) {
    const caching = refresher ? 'network-or-cache' : 'cache-only';
    return this.holiday$ = this.ws.get<Holidays>(`/transix/holidays`, { auth: false, caching }).pipe(
      map(res => res.holidays.filter(holiday => +holiday.holiday_start_date.split('-')[0] >= this.todaysDate.getFullYear())),
    );
  }

  doRefresh(refresher?) {
    this.filteredHoliday$ = this.getHolidays(refresher).pipe(
      tap(_ => this.onFilter()),
      finalize(() => refresher && refresher.target.complete()),
    );
  }

  onFilter() {
    this.filteredHoliday$ = this.holiday$.pipe(
      map(holidays => {
        this.numberOfHolidays = 1; // HIDE 'THERE ARE NO HOLIDAYS' MESSAGE

        let filteredArray = holidays.filter(holiday => {
          // FILTER HOLIDAYS BY DAY & MONTH
          const holidayStartDate = parseISO(holiday.holiday_start_date);
          return (
            format(holidayStartDate, 'eeee').includes(this.filterObject.filterDays) &&
            format(holidayStartDate, 'MMMM').includes(this.filterObject.filterMonths) &&
            holiday.holiday_people_affected.includes(this.filterObject.affecting)
          );
        });
        if (this.filterObject.show === 'upcoming') {
          filteredArray = filteredArray.filter(holiday => {
            // FILTER HOLIDAYS TO THE ONCE UPCOMING ONLY
            return parseISO(holiday.holiday_start_date) > this.todaysDate;
          });
        }

        if (this.filterObject.numberOfDays !== '') {
          filteredArray = filteredArray.filter(holiday => {
            if (this.filterObject.numberOfDays === '1 days') {
              return this.getNumberOfDaysForHoliday(
                parseISO(holiday.holiday_start_date),
                parseISO(holiday.holiday_end_date)) === '1 day';
            } else {
              return this.getNumberOfDaysForHoliday(
                parseISO(holiday.holiday_start_date),
                parseISO(holiday.holiday_end_date)) !== '1 day';
            }
          });
        }
        if (filteredArray.length === 0) { // NO RESULTS => SHOW 'THERE ARE NO HOLIDAYS' MESSAGE
          this.numberOfHolidays = 0;
        }
        return filteredArray;
      }),
      map(holidays => {
        const holidaysEventMode: EventComponentConfigurations[] = [];
        holidays.forEach(holiday => {
          holidaysEventMode.push({
            title: holiday.holiday_name,
            firstDescription: 'For ' + (
              holiday.holiday_people_affected.includes(',')
                ? holiday.holiday_people_affected.replace(',', ' and ')
                : holiday.holiday_people_affected.replace(',', ' and ') + ' only'),
            secondDescription: 'Ends on ' + (
              holiday.holiday_end_date === holiday.holiday_start_date
                ? 'the same day'
                : format(parseISO(holiday.holiday_end_date), 'eeee, dd MMM yyyy')
            ), // EXPECTED FORMAT HH MM A,
            thirdDescription: this.getNumberOfDaysForHoliday(
              parseISO(holiday.holiday_start_date),
              parseISO(holiday.holiday_end_date)),
            color: '#27ae60',
            passColor: '#a49999',
            pass: parseISO(holiday.holiday_start_date) < this.todaysDate,
            outputFormat: 'event-with-date-only',
            type: holiday.holiday_start_date.split('-')[0],
            dateOrTime: format(parseISO(holiday.holiday_start_date), 'dd MMM (eee)'), // EXPECTED FORMAT HH MM A
          });
        });
        return holidaysEventMode;
      })
    );
  }

  // XXX use differentInDays from date-fns instead
  getNumberOfDaysForHoliday(startDate: Date, endDate: Date): string {
    const secondsDiff = this.getSecondsDifferenceBetweenTwoDates(startDate, endDate);
    const daysDiff = Math.floor(secondsDiff / (3600 * 24));
    return (daysDiff + 1) + ' day' + (daysDiff === 0 ? '' : 's');
  }

  getSecondsDifferenceBetweenTwoDates(startDate: Date, endDate: Date): number {
    // PARAMETERS MUST BE STRING. FORMAT IS ('HH:mm A')
    // RETURN TYPE IS STRING. FORMAT: 'HH hrs mm min'
    return (endDate.getTime() - startDate.getTime()) / 1000;
  }

  openMenu() {
    this.menu.enable(true, 'holiday-filter-menu');
    this.menu.open('holiday-filter-menu');
  }

  closeMenu() {
    this.menu.close('holiday-filter-menu');
  }

  defaultFilter() {
    this.storage.get('role').then((role: Role) => {
      this.filterObject = {
        show: 'all',
        filterDays: '',
        filterMonths: '',
        numberOfDays: '',
        affecting: role === Role.Student ? 'students' : 'staff'
      };
    });
  }

  clearFilter() {
    this.defaultFilter();
    this.onFilter();
  }

}
