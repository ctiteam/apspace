import { Pipe, PipeTransform } from '@angular/core';

import { Timetable } from '../../interfaces';

/**
 * Filter all classes for timetable.
 */
@Pipe({ name: 'classes' })
export class ClassesPipe implements PipeTransform {
  /**
   * Filter timetable by intake.
   *
   * @param tt - timetable
   * @param intake - filter intake if exists
   */
  transform(tt: Timetable[] | null, intake: string, ...args): Timetable[] {
    if (Array.isArray(tt)) {
      return intake ? tt.filter(t => intake === t.INTAKE) : tt;
    } else {
      return [] as Timetable[];
    }
  }
}
