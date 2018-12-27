import { Pipe, PipeTransform } from '@angular/core';

/**
 * Filter holidays by role.
 */
@Pipe({ name: 'filter' })
export class FilterRolePipe implements PipeTransform {
  /**
   * Filter holidays for staff.
   *
   * @param holidays - all holdiays
   * @param role - filter holidays by affected role
   */
  transform(holidays: any[] | null, role: 'student' | 'staff'): any[] {
    return (holidays || []).filter(holiday =>
      holiday.holiday_people_affected.split(',').indexOf(role) !== -1);
  }
}
