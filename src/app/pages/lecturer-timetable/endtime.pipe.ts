import { Pipe, PipeTransform } from '@angular/core';

import { LecturerTimetable } from '../../interfaces';

/**
 * End time for lecturer timetable.
 */
@Pipe({
  name: 'endtime'
})
export class EndtimePipe implements PipeTransform {

  /**
   * Calculate end time for lecturer timetable.
   *
   * @param timetable Lecturer timetable
   * @returns endtime End time (epoch) calculated from start time and duration
   */
  transform(timetable: LecturerTimetable): number {
    return Date.parse(timetable.time) + timetable.duration * 1000;
  }

}
