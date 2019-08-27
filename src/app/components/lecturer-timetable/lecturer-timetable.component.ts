import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { LecturerTimetable } from '../../interfaces';
import { WsApiService } from '../../services';

@Component({
  selector: 'lecturer-timetable',
  templateUrl: 'lecturer-timetable.component.html',
  styleUrls: ['lecturer-timetable.component.scss'],
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
  ]
})
export class LecturerTimetableComponent implements OnInit {

  @Input() id: string;

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

  constructor(private ws: WsApiService) { }

  ngOnInit() {
    // GPS counts weeks with January 1, 1980 as first Sunday (Epoch)
    // new Date('1980-01-06').getTime() - new Date().getTimezoneOffset() * 60 * 1000
    const lastDateOfWeekZero = 315993600000;
    const secondsPerWeek = 604800000;  // 7 * 24 * 60 * 60 * 1000

    // Current Week
    const date = new Date();
    const currentWeek = Math.floor((date.getTime() - lastDateOfWeekZero - 1) / secondsPerWeek);

    const endpoint = '/lecturer-timetable/v2/' + this.id;
    this.calendar$ = this.ws.get<LecturerTimetable[]>(endpoint, true, { auth: false }).pipe(
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
      tap(w => this.selectedWeeks.push(Object.keys(this.reverseObject(w))[Object.keys(w).indexOf(`${currentWeek}`)]))
    );
  }

  reverseObject(obj: object): object {
    const object = {};
    const reverse = Object.keys(obj).reverse();
    reverse.map((i) => {
      object[i] = obj[i];
    });

    return object;
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

}
