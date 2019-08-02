import { Pipe, PipeTransform } from '@angular/core';

import { StudentTimetable } from '../../interfaces';

/**
 * Extract timetable room.
 */
@Pipe({
  name: 'rooms'
})
export class RoomsPipe implements PipeTransform {

  /**
   * Pluck sorted unique rooms from timetables.
   *
   * @param timetables - array of timetable
   * @return rooms - unique rooms
   */
  transform(timetables: StudentTimetable[]): string[] {
    return Array.from(new Set(timetables.map(timetable => timetable.ROOM).sort()));
  }

}
