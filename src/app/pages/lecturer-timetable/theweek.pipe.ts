import { Pipe, PipeTransform } from '@angular/core';

import { LecturerTimetable } from '../../interfaces';

@Pipe({ name: 'theweek' })
export class TheweekPipe implements PipeTransform {

  /**
   * Filter timetable by week.
   *
   * @param studentTimetable - timetable
   * @param date - filter week if exists
   */

  transform(studentTimetable: LecturerTimetable[], prevDate: Date): LecturerTimetable[] {
    const nextDate = new Date(prevDate.getTime());  // do not modify prevDate
    nextDate.setDate(nextDate.getDate() + 7);
    return studentTimetable.filter(t => {
      const date = new Date(t.time);
      return prevDate <= date && date < nextDate;
    });
  }
}
