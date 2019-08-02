import { Pipe, PipeTransform } from '@angular/core';

import { StudentTimetable } from '../../interfaces';

/**
 * Filter timetable based on time interval.
 */
@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  /**
   * Filter timetable based on time interval.
   *
   * @param timetables - array of timetable
   * @param since - filter since time HH:MM
   * @param until - filter until time HH:MM
   * @return rooms - filtered timetables
   */
  transform(timetables: StudentTimetable[], since: string | null, until: string | null): StudentTimetable[] {
    const sinceTime = +(since || '00:00').replace(':', '');
    const untilTime = +(until || '24:00').replace(':', '');
    return timetables.filter(timetable => {
      const timeFrom = +timetable.TIME_FROM.replace(':', '').slice(0, 4)
        + (timetable.TIME_FROM.slice(-2) === 'PM' ? 1200 : 0);
      const timeTo = +timetable.TIME_TO.replace(':', '').slice(0, 4)
        + (timetable.TIME_TO.slice(-2) === 'PM' ? 1200 : 0);
      return !(sinceTime <= timeFrom && timeFrom < untilTime)
        && !(sinceTime <= timeTo && timeTo < untilTime)
        && !(timeFrom <= sinceTime && untilTime < timeTo)
        && !(timetable.ROOM.toUpperCase().includes('LAB') && (1900 <= sinceTime || 1900 <= untilTime));
    });
  }

}
