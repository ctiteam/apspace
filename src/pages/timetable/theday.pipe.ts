import { Pipe, PipeTransform } from '@angular/core';

import { Timetable } from '../../interfaces';

/**
 * Filter day for timetable.
 */
@Pipe({ name: 'theday' })
export class TheDayPipe implements PipeTransform {
  /**
   * Filter timetable by day.
   *
   * @param tt - timetable
   * @param date - filter day if exists
   */
  transform(tt: Timetable[], date: Date): Timetable[] {
    return tt.filter(t => new Date(t.DATESTAMP_ISO).getDate() === date.getDate());
  }
}
