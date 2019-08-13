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
   * @param studentTimetable Array of timetable
   * @param intake Filter by intake if not null
   */
  transform(studentTimetable: StudentTimetable[] | null, intake: string): StudentTimetable[] {
    if (intake && Array.isArray(studentTimetable)) {
      return studentTimetable.filter(t => intake === t.INTAKE);
    } else {
      return []; // No timetable for staff
    }
  }

}
