import { Pipe, PipeTransform } from '@angular/core';

import { Timetable } from '../../interfaces';

/**
 * Filter week for timetable.
 */
@Pipe({ name: 'theweek' })
export class TheWeekPipe implements PipeTransform {
  /**
   * Filter timetable by week.
   *
   * @param tt - timetable
   * @param date - filter week if exists
   */
  transform(tt: Timetable[], date: Date): Timetable[] {
    const sinceDate = new Date(date.getTime());  // do not modify date
    sinceDate.setDate(sinceDate.getDate() - 1);
    const untilDate = new Date(date.getTime());  // do not modify date
    untilDate.setDate(untilDate.getDate() + 6);
    return tt.filter(t => {
      const selectedDate = new Date(t.DATESTAMP_ISO);
      return sinceDate < selectedDate && selectedDate < untilDate;
    });
  }
}
