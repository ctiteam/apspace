import { Pipe, PipeTransform } from '@angular/core';

import { LecturerTimetable } from '../../interfaces';

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
  transform(studentTimetable: LecturerTimetable[], date: Date | undefined): LecturerTimetable[] {
    if (date !== undefined) {
      const dayOfWeek = date.getDate();
      return studentTimetable.filter(t => new Date(t.time).getDate() === dayOfWeek);
    } else {
      return [];
    }
  }

}
