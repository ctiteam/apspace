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
   * @param intake - filter intaek on timetable
   */
  transform(tt: Timetable[] | null, intake: string, ...args): Timetable[] {
    if (!Array.isArray(tt)) {
      return [] as Timetable[];
    } else if (!intake) {
      return [] as Timetable[]; /* TODO: My Classes */
    } else {
      return intake ? tt.filter(t => intake === t.INTAKE) : tt;
    }
  }
}
