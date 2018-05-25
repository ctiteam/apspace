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
   * @param day - filter day if exists
   */
  transform(tt: Timetable[], day: string): Timetable[] {
    return tt.filter(t => t.DAY === day);
  }
}
