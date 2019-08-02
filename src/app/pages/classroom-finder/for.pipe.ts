import { Pipe, PipeTransform } from '@angular/core';

import { StudentTimetable } from '../../interfaces';

/**
 * Filter timetable based on room.
 */
@Pipe({
  name: 'for'
})
export class ForPipe implements PipeTransform {

  typeMap = {
    auditorium: ['Auditorium'],
    classroom: ['A-', 'B-', 'C-', 'D-', 'E-', 'L3'],
    labotory: ['LAB', 'Lab', 'Workshop', 'Studio', 'Suite']
  };

  /**
   * Filter timetable based on type of room.
   *
   * @param timetables - array of timetable
   * @param types - type of room to filter
   * @return rooms - filtered timetables
   */
  transform(timetables: StudentTimetable[], types: string[]): StudentTimetable[] {
    if (types.length === Object.keys(this.typeMap).length) {
      return timetables;
    } else {
      const fullTypes = [].concat.apply([], types.map(t => this.typeMap[t]));
      return timetables.filter(timetable => fullTypes.some(t => timetable.ROOM.includes(t)));
    }
  }

}
