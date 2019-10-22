import { Pipe, PipeTransform } from '@angular/core';

import { StudentTimetable } from '../../interfaces';

/**
 * Non-occupied timetable.
 */
@Pipe({
  name: 'on'
})
export class OnPipe implements PipeTransform {

  /**
   * Filter timetable based on day of week, since and until time.
   *
   * @param timetables - array of timetable
   * @param day - day of week to be filtered
   * @param since - filter since time HH:MM
   * @param until - filter until time HH:MM
   * @return rooms - unique rooms
   */
  transform(timetables: StudentTimetable[], day: string, since: string | null, until: string | null): string[] {
    const sinceTime = +(since || '00:00').replace(':', '');
    const untilTime = +(until || '24:00').replace(':', '');
    const allRooms = new Set(timetables.map(timetable => timetable.ROOM).sort());
    // remove occupied rooms
    timetables.forEach(timetable => {
      if (timetable.DAY !== day) {
        return;
      }
      const timeFrom = +timetable.TIME_FROM.replace(':', '').slice(0, 4)
        + (timetable.TIME_FROM.slice(-2) === 'PM' ? 1200 : 0);
      const timeTo = +timetable.TIME_TO.replace(':', '').slice(0, 4)
        + (timetable.TIME_TO.slice(-2) === 'PM' ? 1200 : 0);
      if ((sinceTime <= timeFrom && timeFrom < untilTime)
        || (sinceTime <= timeTo && timeTo < untilTime)
        || (timeFrom <= sinceTime && untilTime < timeTo)
        || (timetable.ROOM.toUpperCase().includes('LAB') && (1900 <= sinceTime || 1900 <= untilTime))) {
        allRooms.delete(timetable.ROOM);
      }
    });
    return Array.from(allRooms);
  }

}
