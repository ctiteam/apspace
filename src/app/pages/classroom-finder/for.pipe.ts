import { Pipe, PipeTransform } from '@angular/core';

import { StudentTimetable } from '../../interfaces';
import { classroomTypes } from './types';

/**
 * Filter timetable based on room.
 */
@Pipe({
  name: 'for'
})
export class ForPipe implements PipeTransform {

  static readonly typeMap = classroomTypes.reduce((acc, { key, value }) => (acc[key] = value, acc), {});

  /**
   * Filter timetable based on type of room.
   *
   * @param timetables - array of timetable
   * @param types - type of room to filter
   * @return rooms - filtered timetables
   */
  transform(timetables: StudentTimetable[], types: string[]): StudentTimetable[] {
    if (types.length === Object.keys(ForPipe.typeMap).length) {
      return timetables;
    } else {
      const fullTypes = [].concat(...types.map(t => ForPipe.typeMap[t]));
      return timetables.filter(timetable => fullTypes.some(t => timetable.ROOM.includes(t)));
    }
  }

}
