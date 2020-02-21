import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CustomDateTimePipe } from 'src/app/shared/customdatepipe/customdatetime';
import { StudentTimetable } from '../../interfaces';
import { StudentTimetableService } from '../../services';
import { classroomTypes } from './types';

import * as moment from 'moment';

@Component({
  selector: 'app-classroom-finder',
  templateUrl: './classroom-finder.page.html',
  styleUrls: ['./classroom-finder.page.scss'],
  providers: [ CustomDateTimePipe ]
})
export class ClassroomFinderPage implements OnInit {

  location = 'NEW CAMPUS';
  day: string;
  since: string;
  until: string;
  types = classroomTypes.map(t => t.key);
  classroomTypes = classroomTypes;

  days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  timetables$: Observable<StudentTimetable[]>;

  constructor(public tt: StudentTimetableService) { }

  ngOnInit() {
    this.timetables$ = this.tt.get();
    // FORCE +08
    const date = moment(moment(new Date()).utcOffset('+0800').format('hh:mm A'), 'HH:mm A').toDate();

    // days start from monday
    this.day = this.days[(date.getDay() + 6) % 7];

    this.since = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
    this.until = `${('0' + (date.getHours() + 1)).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
  }

  changeSince(value: string) {
    const since = +value.replace(':', '');
    const until = +this.until.replace(':', '');
    if (until < since) {
      const newUntil = since + 100; // add one hour
      const hh = ('0' + Math.trunc(newUntil / 100)).slice(-2);
      const mm = ('0' + newUntil % 100).slice(-2);
      this.until = `${hh}:${mm}`;
    }
  }

  changeUntil(value: string) {
    const since = +this.since.replace(':', '');
    const until = +value.replace(':', '');
    if (until < since) {
      const newSince = until - 100; // minus one hour
      const hh = ('0' + Math.trunc(newSince / 100)).slice(-2);
      const mm = ('0' + newSince % 100).slice(-2);
      this.since = `${hh}:${mm}`;
    }
  }

  trackByName(value: string) {
    return value;
  }

}
