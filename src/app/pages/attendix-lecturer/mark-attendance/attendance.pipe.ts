import { Pipe, PipeTransform } from '@angular/core';

import { Status } from '../../../../generated/graphql';

/**
 * Filter type of attendance.
 */
@Pipe({
  name: 'attendance'
})
export class AttendancePipe implements PipeTransform {

  /**
   * Filter type of attendance or return everything.
   *
   * @param students - array of student
   * @param attendance - matched attendance
   * @return students - filtered students
   */
  transform(students: Partial<Status>[] | null, attendance: string): Partial<Status>[] {
    if (students === null) {
      return [];
    } else if (attendance) {
      return students.filter(student => student.attendance === attendance);
    } else {
      return students;
    }
  }

}
