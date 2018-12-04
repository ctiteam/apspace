import { Pipe, PipeTransform } from '@angular/core';
import { Timetable } from '../../interfaces';

/**
 * Filter all classes for timetable.
 */
@Pipe({ name: 'in' })
export class RoomPipe implements PipeTransform {
  /**
   * Filter timetable by room.
   *
   * @param tt - timetable
   * @param room - filter room if exists
   */
  transform(tt: Timetable[] | null, room: string, ...args): Timetable[] {
    const resp = (tt || []).filter(t => room === t.ROOM).filter(
      (t, index, self) => index === self.findIndex(
        ft => (
          t.MODID === ft.MODID
          && t.DATESTAMP_ISO === ft.DATESTAMP_ISO
          && t.TIME_FROM === ft.TIME_FROM
          && t.TIME_TO === ft.TIME_TO
          && t.LECTID === ft.LECTID
        ),
      ),
    ).sort(
      (a, b) => {
        return Date.parse(a.DATESTAMP_ISO.split('-').join('/') + ' ' + a.TIME_FROM)
          - Date.parse(b.DATESTAMP_ISO.split('-').join('/') + ' ' + b.TIME_FROM);
      },
    );
    return this.generateFreeSlots(resp);
  }

  generateFreeSlots(tt) {
    const ttWithFreeSlots: Timetable[] = [];
    // let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    tt.forEach((t, index, self) => {
      // Classrooms are available from 08:30 AM
      if (index === 0 && t.TIME_FROM !== '08:30 AM') {
        ttWithFreeSlots.push(this.freeSlots('08:30 AM', t.TIME_FROM, t));
        ttWithFreeSlots.push(t);
      } else if (index > 0 && t.DAY !== self[index - 1].DAY && t.TIME_FROM !== '08:30 AM') {
        ttWithFreeSlots.push(this.freeSlots('08:30 AM', t.TIME_FROM, t));
        ttWithFreeSlots.push(t);
      } else if (index + 1 !== self.length && t.DAY === self[index + 1].DAY &&
        t.TIME_TO !== self[index + 1].TIME_FROM &&
        (Date.parse(self[index +
          1].DATESTAMP_ISO.split('-').join('/') + ' ' +
          self[index + 1].TIME_FROM) -
          Date.parse(t.DATESTAMP_ISO.split('-').join('/')
            + ' ' + t.TIME_TO)) / 1000 > 300) {
        ttWithFreeSlots.push(t);
        ttWithFreeSlots.push(this.freeSlots(t.TIME_TO, self[index + 1].TIME_FROM, t));
      } else if (index + 1 !== self.length && t.TIME_TO !== '07:00 PM'
        && t.ROOM.toUpperCase().indexOf('LAB') !== -1 && t.DAY !== self[index + 1].DAY) {
        ttWithFreeSlots.push(t);
        // Only show Free slot before 09:30 PM
        if (Date.parse(t.DATESTAMP_ISO.split('-').join('/') + ' ' + t.TIME_TO)
          < Date.parse(t.DATESTAMP_ISO.split('-').join('/') + ' ' + '07:00 PM')) {
          ttWithFreeSlots.push(this.freeSlots(t.TIME_TO, '07:00 PM', t));
        }
      } else if (index + 1 === self.length && t.TIME_TO !== '07:00 PM' && t.ROOM.toUpperCase().indexOf('LAB') !== -1) {
        ttWithFreeSlots.push(t);
        // Only show Free slot before 09:30 PM
        if (Date.parse(t.DATESTAMP_ISO.split('-').join('/') + ' ' + t.TIME_TO)
          < Date.parse(t.DATESTAMP_ISO.split('-').join('/') + ' ' + '07:00 PM')) {
          ttWithFreeSlots.push(this.freeSlots(t.TIME_TO, '07:00 PM', t));
        }
      } else if (index + 1 !== self.length && t.TIME_TO !== '09:30 PM' && t.DAY !== self[index + 1].DAY) {
        ttWithFreeSlots.push(t);
        // Only show Free slot before 09:30 PM
        if (Date.parse(t.DATESTAMP_ISO.split('-').join('/') + ' ' + t.TIME_TO)
          < Date.parse(t.DATESTAMP_ISO.split('-').join('/') + ' ' + '09:30 PM')) {
          ttWithFreeSlots.push(this.freeSlots(t.TIME_TO, '09:30 PM', t));
        }
      } else if (index + 1 === self.length && t.TIME_TO !== '09:30 PM') {
        ttWithFreeSlots.push(t);
        // Only show Free slot before 09:30 PM
        if (Date.parse(t.DATESTAMP_ISO.split('-').join('/') + ' ' + t.TIME_TO)
          < Date.parse(t.DATESTAMP_ISO.split('-').join('/') + ' ' + '09:30 PM')) {
          ttWithFreeSlots.push(this.freeSlots(t.TIME_TO, '09:30 PM', t));
        }
      } else {
        ttWithFreeSlots.push(t);
      }
    });
    return ttWithFreeSlots;
  }

  freeSlots(timeFrom, timeTo, t) {
    return {
      INTAKE: '',
      MODID: 'FREE',
      DAY: t.DAY,
      LOCATION: t.LOCATION,
      ROOM: t.ROOM,
      LECTID: '',
      NAME: 'PUBLIC',
      SAMACCOUNTNAME: '',
      DATESTAMP: t.DATESTAMP,
      DATESTAMP_ISO: t.DATESTAMP_ISO,
      TIME_FROM: timeFrom,
      TIME_TO: timeTo,
    };
  }
}
