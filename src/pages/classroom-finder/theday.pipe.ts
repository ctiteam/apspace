import { Pipe, PipeTransform } from '@angular/core';

import { Timetable } from '../../interfaces';

/**
 * Filter day for timetable.
 */
@Pipe({ name: 'filterday' })
export class FilterDayPipe implements PipeTransform {
  /**
   * Filter timetable by day.
   *
   * @param tt - timetable
   * @param date - filter day if exists
   */
  transform(tt: Timetable[], date: Date): Timetable[] {
    let ttWithFreeSlots = [];
    tt.forEach(t => {
      try {
        if (new Date(t.DATESTAMP_ISO).getDate() === date.getDate()) {
          ttWithFreeSlots.push(t);
        }
      } catch (error) {
        ttWithFreeSlots = [{
          INTAKE: '',
          MODID: 'FREE',
          DAY: '',
          LOCATION: '',
          ROOM: '',
          LECTID: '',
          NAME: '',
          SAMACCOUNTNAME: '',
          DATESTAMP: '',
          DATESTAMP_ISO: '',
          TIME_FROM: '08:30 AM',
        }];
        if (tt[0].ROOM.toUpperCase().indexOf('LAB') !== -1) {
          ttWithFreeSlots[0].TIME_TO = '07:00 PM';
        } else {
          ttWithFreeSlots[0].TIME_TO = '09:30 PM';
        }
      }
    });
    return ttWithFreeSlots;
  }
}
