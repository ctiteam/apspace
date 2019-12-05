import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as moment from 'moment';
import { LecturerTimetable } from '../../interfaces';
import { WsApiService } from '../../services';
@Component({
  selector: 'lecturer-timetable',
  templateUrl: 'lecturer-timetable.component.html',
  styleUrls: ['lecturer-timetable.component.scss'],
})
export class LecturerTimetableComponent implements OnInit {

  printUrl = 'https://api.apiit.edu.my/timetable-print/index.php';

  @Input() id: string;
  @Input() code: string;
  calendar$: Observable<{
    [week: number]: Array<{
      name: string,
      type: 'lecturerTimetable',
      intake: string[],
      start: string,
      end: number,
      loc: string,
    }>;
  }>;
  selectedWeeks: string[] = [];

  constructor(private ws: WsApiService, private iab: InAppBrowser) { }

  ngOnInit() {
    // GPS counts weeks with January 1, 1980 as first Sunday (Epoch)
    // new Date('1980-01-06').getTime() - new Date().getTimezoneOffset() * 60 * 1000
    const lastDateOfWeekZero = 315993600000;
    const secondsPerWeek = 604800000;  // 7 * 24 * 60 * 60 * 1000

    // Current Week
    const date = new Date();
    const currentWeek = Math.floor((date.getTime() - lastDateOfWeekZero - 1) / secondsPerWeek);

    const endpoint = '/lecturer-timetable/v2/' + this.id;
    this.calendar$ = this.ws.get<LecturerTimetable[]>(endpoint, { auth: false }).pipe(
      map(timetables => timetables.reduce((acc, d) => {
        const time = new Date(d.time);

        // unique week - subtract from week zero (-1ms to exclude 0000ms)
        const week = Math.floor((time.getTime() - lastDateOfWeekZero - 1) / secondsPerWeek);

        acc[week] = (acc[week] || []).concat({
          type: 'lecturerTimetable',
          module: d.module,
          start: time,
          end: time.getTime() + d.duration * 1000,
          loc: d.room + ' ' + d.location,
          intakes: d.intakes,
        });

        return acc;
      }, {})),
      tap(() => this.selectedWeeks.push(`${currentWeek}`))
    );
  }

  /** Display schedule. */
  show(week: string, el: HTMLElement) {
    if (!this.selectedWeeks.includes(week)) {
      this.selectedWeeks.push(week);
      setTimeout(() => el.parentElement.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      this.selectedWeeks.splice(this.selectedWeeks.indexOf(week), 1);
    }
  }

  sendToPrint(week: string) {
    const lastDateOfWeekZero = 315993600000;
    const secondsPerWeek = 604800000;  // 7 * 24 * 60 * 60 * 1000
    const secondsPerDay = 86400000;  // 24 * 60 * 60 * 1000
    const weekDateMomentObj = moment(+week * secondsPerWeek + lastDateOfWeekZero + secondsPerDay);
    // tslint:disable-next-line: max-line-length
    const formattedWeek = weekDateMomentObj.add(1, 'day').format('YYYY-MM-DD'); // week in apspace starts with sunday, API starts with monday
    // tslint:disable-next-line: max-line-length
    this.iab.create(`${this.printUrl}?LectID=${this.code}&Submit=Submit&Week=${formattedWeek}&print_request=print`, '_system', 'location=true');
  }

}
