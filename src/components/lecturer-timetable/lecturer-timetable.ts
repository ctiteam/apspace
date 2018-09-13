import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';

import { LecturerTimetable } from '../../interfaces';
import { WsApiProvider } from '../../providers';

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

  calendar$: Observable<Array<{
    week: Date,
    days: Array<{
      day: Date,
      events: Array<{
        name: string,
        type: 'lecturerTimetable',
        start: string,
        end: string,
        loc: string,
      }>,
    }>,
  }>>;
  selectedWeeks = [];

  constructor(private ws: WsApiProvider) { }

  ngOnInit() {
    // January 5, 1970 00:00:00
    const lastDateOfWeekZero = new Date(318599999).getTime();

    const endpoint = '/lecturer-timetable/' + this.id;
    this.calendar$ = this.ws.get<LecturerTimetable[]>(endpoint, true, { auth: false }).pipe(
      map(data => {
        const t = {} as any; // temporary Map for data processing
        data.forEach(d => {
          const since = new Date(d.since);

          // unique week - subtract from week zero and by 24 * 3600 * 1000 * 7
          const week = Math.ceil((since.getTime() - lastDateOfWeekZero) / 604800000);
          t[week] = t[week] || {};

          const day = since.getDay();
          t[week][day] = (t[week][day] || []).concat({
            type: 'lecturerTimetable',
            name: d.module,
            start: since,
            end: d.until,
            loc: `${d.room} @ ${d.location}`,
          });
        });

        return Object.keys(t).map(w => {
          const week = parseInt(w, 10) * 604800000;
          return {
            week: new Date(week),
            days: Object.keys(t[w]).map(d => {
              return {
                day: new Date(week + parseInt(d, 10) * 86400000),
                events: t[w][d],
              };
            }),
          };
        });
      }),
      tap(w => this.selectedWeeks.push(w[0])),
    );
  }

  /** Display schedule. */
  show(week: any) {
    if (this.selectedWeeks.indexOf(week) === -1) {
      this.selectedWeeks.push(week);
    } else {
      this.selectedWeeks.splice(this.selectedWeeks.indexOf(week), 1);
    }
  }

}
