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

  transform(studentTimetable: StudentTimetable[], date: Date): StudentTimetable[] {
    const nextDate = new Date(date.getTime());  // do not modify date
    nextDate.setDate(nextDate.getDate() + 7);
    return studentTimetable.filter(t => new Date(t.DATESTAMP_ISO) < nextDate);
  }
}
