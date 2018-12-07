import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';

import { LecturerTimetable } from '../../interfaces';
import { WsApiProvider } from '../../providers';

// simple local interface used for displaying data
interface DispCalEvent {
  week: Date;
  days: Array<{
    day: Date,
    events: Array<{
      name: string,
      type: 'lecturerTimetable',
      intake: string[],
      start: string,
      end: number,
      loc: string,
    }>,
  }>;
}

@Component({
  selector: 'lecturer-timetable',
  templateUrl: 'lecturer-timetable.html',
  animations: [
    trigger('easeInOut', [
      transition('void => *', [
        style({ opacity: '.1', height: '0' }),
        animate('250ms ease-in', style({ opacity: '1', height: '*' })),
      ]),
      transition('* => void', [
        style({ opacity: '1', height: '*' }),
        animate('150ms ease-out', style({ opacity: '.7', height: '0', paddingBottom: '0' })),
      ]),
    ]),
  ],
})
export class LecturerTimetableComponent implements OnInit {

  @Input() id: string;

  calendar$: Observable<DispCalEvent[]>;
  selectedWeeks: DispCalEvent[] = [];

  constructor(private ws: WsApiProvider) { }

  ngOnInit() {
    // GPS counts weeks with January 1, 1980 as first Sunday (Epoch)
    // new Date('1980-01-06').getTime() - new Date().getTimezoneOffset() * 60 * 1000
    const lastDateOfWeekZero = 315993600000;
    const secondsPerWeek = 604800000;  // 7 * 24 * 60 * 60 * 1000
    const secondsPerDay = 86400000;  // 24 * 60 * 60 * 1000

    const endpoint = '/lecturer-timetable/v2/' + this.id;
    this.calendar$ = this.ws.get<LecturerTimetable[]>(endpoint, true, { auth: false }).pipe(
      map(data => {
        const t = {} as any; // temporary Map for data processing
        data.forEach(d => {
          const time = new Date(d.time);

          // unique week - subtract from week zero (-1ms to exclude 0000ms)
          const week = Math.floor((time.getTime() - lastDateOfWeekZero - 1) / secondsPerWeek);
          t[week] = t[week] || {};

          const day = time.getDay();
          t[week][day] = (t[week][day] || []).concat({
            type: 'lecturerTimetable',
            name: d.module,
            start: time,
            end: time.getTime() + d.duration * 1000,
            loc: d.room + ' ' + d.location,
            intakes: d.intakes,
          });
        });

        return Object.keys(t).map(w => {
          // convert week time epoch to date
          const week = parseInt(w, 10) * secondsPerWeek + lastDateOfWeekZero;
          return {
            week: new Date(week + secondsPerDay),  // displayed week as Monday (+1d)
            days: Object.keys(t[w]).map(d => ({
              day: new Date(week + parseInt(d, 10) * secondsPerDay),
              events: t[w][d],
            })),
          };
        });
      }),
      tap(w => this.selectedWeeks.push(w[0])),
    );
  }

  /** Display schedule. */
  show(week: DispCalEvent, el: HTMLElement) {
    if (this.selectedWeeks.indexOf(week) === -1) {
      this.selectedWeeks.push(week);
      setTimeout(() => el.parentElement.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      this.selectedWeeks.splice(this.selectedWeeks.indexOf(week), 1);
    }
  }

}
