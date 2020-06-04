import { Pipe, PipeTransform } from '@angular/core';

import { StudentTimetable } from '../../interfaces';

/**
 * Filter all classes for timetable.
 */
@Pipe({
  name: 'classes'
})
export class ClassesPipe implements PipeTransform {

  /**
   * Filter timetable by intake.
   *
   * @param timetables Array of timetable
   * @param intake Filter by intake if not null
   * @param room Filter by room if not null
   * @returns filtered Filtered timetable
   */
  transform(timetables: StudentTimetable[], intake: string, room: string, grouping: string): StudentTimetable[] {
    if (!Array.isArray(timetables)) {
      return [];
    } else if (intake && room && grouping) {
      return timetables.filter(t => intake === t.INTAKE && room === t.ROOM && (grouping === t.GROUPING || grouping === 'All'));
    } else if (intake && room) {
      return timetables.filter(t => intake === t.INTAKE && room === t.ROOM);
    } else if (intake && grouping) {
      return timetables.filter(t => intake === t.INTAKE && (grouping === t.GROUPING || grouping === 'All'));
    } else if (intake) {
      return timetables.filter(t => intake === t.INTAKE);
    } else if (room) {
      return timetables.filter(t => room === t.ROOM);
    } else { // no filter provided
      return [];
    }
  }

}
