import { Pipe, PipeTransform } from '@angular/core';

import { StudentTimetable } from '../../interfaces';

/**
 * Filter timetable by location.
 */
@Pipe({
  name: 'at'
})
export class AtPipe implements PipeTransform {

  /**
   * Filter timetable based on location.
   *
   * @param timetables - array of timetable
   * @param location - location to be filtered
   * @return rooms - filtered timetables
   */
  transform(timetables: StudentTimetable[] | null, location: string): StudentTimetable[] {
    return (timetables || []).filter(timetable => timetable.LOCATION === location);
  }

}
