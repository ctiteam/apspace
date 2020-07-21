import { Pipe, PipeTransform } from '@angular/core';

import { StudentTimetable } from '../../interfaces';

@Pipe({ name: 'theweek' })
export class TheWeekPipe implements PipeTransform {

  /**
   * Filter timetable by week.
   *
   * @param studentTimetable - timetable
   * @param date - filter week if exists
   */

  transform(studentTimetable: StudentTimetable[], prevDate: Date): StudentTimetable[] {
    const nextDate = new Date(prevDate.getTime());  // do not modify prevDate
    nextDate.setDate(nextDate.getDate() + 7);
    return studentTimetable.filter(t => {
      const date = new Date(t.DATESTAMP_ISO);
      return prevDate <= date && date < nextDate;
    });
  }
}
