import { Pipe, PipeTransform } from '@angular/core';

import { StudentTimetable } from '../../interfaces';

/**
 * Filter day for timetable.
 */
@Pipe({
  name: 'theday'
})
export class ThedayPipe implements PipeTransform {

  /**
   * Filter timetable by day.
   *
   * @param studentTimetable Array of timetable
   * @param date Filter day or return empty array if undefined
   */
  transform(studentTimetable: StudentTimetable[], date: Date | undefined): StudentTimetable[] {
    if (date !== undefined) {
      const dayOfWeek = date.getDate();
      return studentTimetable.filter(t => new Date(t.DATESTAMP_ISO).getDate() === dayOfWeek);
    } else {
      return [];
    }
  }

}
