import { Pipe, PipeTransform } from '@angular/core';

import { StaffDirectory } from '../../interfaces';

/**
 * Filter department for staff directory.
 */
@Pipe({ name: 'in' })
export class DepartmentPipe implements PipeTransform {
  /**
   * Filter staff directory by department.
   *
   * @param sd - staff directory
   * @param dept - filter department if exists
   */
  transform(sd: StaffDirectory[] | null, dept: string): StaffDirectory[] {
    return (sd || []).filter(s => !dept || [s.DEPARTMENT, s.DEPARTMENT2, s.DEPARTMENT3].includes(dept));
  }
}
