import { Pipe, PipeTransform } from '@angular/core';

import { StudentTimetable } from '../../interfaces';

/**
 * Filter timetable by day of week.
 */
@Pipe({
  name: 'on'
})
export class OnPipe implements PipeTransform {

  /**
   * Filter timetable based on day of week.
   *
   * @param timetables - array of timetable
   * @param day - day of week to be filtered
   * @return rooms - filtered timetables
   */
  transform(timetables: StudentTimetable[], day: string): StudentTimetable[] {
    return timetables.filter(timetable => timetable.DAY === day);
  }

}
