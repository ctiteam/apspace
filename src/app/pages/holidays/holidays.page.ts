import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import differenceInDays from 'date-fns/differenceInDays';
import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { Holiday, Holidays, Role } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';



@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.page.html',
  styleUrls: ['./holidays.page.scss'],
})
export class HolidaysPage implements OnInit {
  holiday$: Observable<Holiday[]>;
  filteredHoliday$: Observable<Holiday[]>;
  openDate: string;
  datesConfig: DayConfig[] = [];
  options: CalendarComponentOptions = {
    daysConfig: this.datesConfig,
    weekStart: 1,
  };
  holidayTitle: string;
  holidaysAffected: string;
  showDetails: boolean;
  userClickedOnce: boolean;
  remainingDays: string;
  recordsArray: Holiday[] = [];
  todaysDate = new Date();
  affecting: 'students' | 'staff';

  constructor(
    private ws: WsApiService,
    private datePipe: DatePipe,
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

  holidayItemOnChange($event: any) {
    this.userClickedOnce = true;
    this.showDetails = false;
    this.recordsArray.forEach((res) => {
      const date = this.datePipe.transform(new Date(res.holiday_start_date), 'yyyy-MM-dd');

      if ($event === date) {

        const dayDifference = differenceInDays(
          new Date(res.holiday_start_date),
          this.todaysDate
        );
        if (date === res.holiday_start_date) {
          this.holidayTitle = res.holiday_name;
          this.holidaysAffected = res.holiday_people_affected;
          // tslint:disable-next-line: max-line-length
          this.remainingDays = dayDifference < 0 ? Math.abs(dayDifference) + ' Days Ago' : dayDifference === 0 ? 'Today' : dayDifference === 1 ? '1 Day Remaining' : dayDifference + ' Days Remaining';
          this.showDetails = true;
        }
      }
    });
  }

  onFilter() {
    this.filteredHoliday$ = this.holiday$.pipe(
      map(holidays => {

        return holidays.filter(holiday => {

          return (
            holiday.holiday_people_affected.includes(this.affecting)
          );
        });
      }),
      tap(filteredHolidays => {
        // Did not user global variable of today's date because we are modifying the const
        const today = new Date();

        today.setMonth(0);
        today.setDate(0);

        this.options = {
          from: today,
          daysConfig: this.datesConfig,
        };

        filteredHolidays.forEach(holiday => {
          this.datesConfig.push({
            date: new Date(holiday.holiday_start_date),
            marked: true,
            disable: false,
            subTitle: '.',
            cssClass: 'holiday',
          });

          this.recordsArray.push({
            holiday_id: holiday.holiday_id,
            holiday_name: holiday.holiday_name,
            holiday_description: holiday.holiday_description,
            holiday_start_date: holiday.holiday_start_date,
            holiday_end_date: holiday.holiday_end_date,
            holiday_people_affected: holiday.holiday_people_affected

          });
        });

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

  defaultFilter() {
    this.storage.get('role').then((role: Role) => {
      this.affecting = role === Role.Student ? 'students' : 'staff';
    });
  }

}
