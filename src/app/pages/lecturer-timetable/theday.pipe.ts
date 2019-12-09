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
      const month = date.getMonth();
      const dayOfMonth = date.getDate();
      return studentTimetable.filter(t => {
        const d = new Date(t.time);
        return d.getMonth() === month && d.getDate() === dayOfMonth;
      });
    } else {
      return [];
    }
  }

}
