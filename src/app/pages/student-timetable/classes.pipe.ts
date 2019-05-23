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
   * @param tt Array of timetable
   * @param intake Filter by intake if not null
   */
  transform(tt: StudentTimetable[] | null, intake: string): StudentTimetable[] {
    if (!Array.isArray(tt)) {
      return [] as StudentTimetable[];
    } else if (intake) {
      return tt.filter(t => intake === t.INTAKE);
    } else {
      return tt;
    }
  }

}
