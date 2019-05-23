import { Pipe, PipeTransform } from '@angular/core';

import { StaffDirectory } from '../../interfaces';

/**
 * Filter department for staff directory.
 */
@Pipe({
  name: 'department'
})
export class DepartmentPipe implements PipeTransform {

  /**
   * Filter staff directory by department.
   *
   * @param sd Array of staffs
   * @param dept Filter department if exists
   */
  transform(sd: StaffDirectory[] | null, dept: string): StaffDirectory[] {
    return (sd || []).filter(s => !dept || [s.DEPARTMENT, s.DEPARTMENT2, s.DEPARTMENT3].includes(dept));
  }

}
