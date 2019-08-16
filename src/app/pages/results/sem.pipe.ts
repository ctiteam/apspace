import { Pipe, PipeTransform } from '@angular/core';
import { Subcourse } from '../../interfaces';

/**
 * Sort courses by semester in descending order
 */
@Pipe({ name: 'sem' })
export class SemPipe implements PipeTransform {
  /**
   * @param results  - results
   */
  transform(results: Subcourse[] | null): Subcourse[] {
    return (results || []).sort((a, b) => +(a.SEMESTER < b.SEMESTER));
  }
}
