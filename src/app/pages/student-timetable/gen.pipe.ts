import { Pipe, PipeTransform } from '@angular/core';

import { StudentTimetable } from '../../interfaces';

/**
 * Timetable generator.
 */
@Pipe({
  name: 'gen'
})
export class GenPipe implements PipeTransform {

  /**
   * Generate free time for classes.
   *
   * @param timetables Array of timetable
   * @param freeTime Toggle to generate
   * @returns generated Generated timetable
   */
  transform(timetables: StudentTimetable[], freeTime: boolean): StudentTimetable[] {
    if (!freeTime) {
      return timetables;
    }
    // unique sorted timetable
    timetables = timetables.filter((timetable, index, self) =>
      index === self.findIndex(ft =>
        timetable.MODID === ft.MODID
        && timetable.DATESTAMP_ISO === ft.DATESTAMP_ISO
        && timetable.TIME_FROM === ft.TIME_FROM
        && timetable.TIME_TO === ft.TIME_TO
        && timetable.LECTID === ft.LECTID)).sort((a, b) =>
          Date.parse(a.DATESTAMP_ISO.split('-').join('/') + ' ' + a.TIME_FROM)
          - Date.parse(b.DATESTAMP_ISO.split('-').join('/') + ' ' + b.TIME_FROM));
    return this.generateFreeSlots(timetables);
  }

  generateFreeSlots(timetables: StudentTimetable[]) {
    const ttWithFreeSlots: StudentTimetable[] = [];
    timetables.forEach((timetable, index, self) => {
      // Classrooms are available from 08:30 AM
      if (index === 0 && timetable.TIME_FROM !== '08:30 AM') {
        ttWithFreeSlots.push(this.freeSlots('08:30 AM', timetable.TIME_FROM, timetable));
        ttWithFreeSlots.push(timetable);
      } else if (index > 0 && timetable.DAY !== self[index - 1].DAY && timetable.TIME_FROM !== '08:30 AM') {
        ttWithFreeSlots.push(this.freeSlots('08:30 AM', timetable.TIME_FROM, timetable));
        ttWithFreeSlots.push(timetable);
      } else if (index + 1 !== self.length && timetable.DAY === self[index + 1].DAY &&
        timetable.TIME_TO !== self[index + 1].TIME_FROM &&
        (Date.parse(self[index +
          1].DATESTAMP_ISO.split('-').join('/') + ' ' +
          self[index + 1].TIME_FROM) -
          Date.parse(timetable.DATESTAMP_ISO.split('-').join('/')
            + ' ' + timetable.TIME_TO)) / 1000 > 300) {
        ttWithFreeSlots.push(timetable);
        ttWithFreeSlots.push(this.freeSlots(timetable.TIME_TO, self[index + 1].TIME_FROM, timetable));
      } else if (index + 1 !== self.length && timetable.TIME_TO !== '07:00 PM'
        && timetable.ROOM.toUpperCase().indexOf('LAB') !== -1 && timetable.DAY !== self[index + 1].DAY) {
        ttWithFreeSlots.push(timetable);
        // Only show Free slot before 09:30 PM
        if (Date.parse(timetable.DATESTAMP_ISO.split('-').join('/') + ' ' + timetable.TIME_TO)
          < Date.parse(timetable.DATESTAMP_ISO.split('-').join('/') + ' ' + '07:00 PM')) {
          ttWithFreeSlots.push(this.freeSlots(timetable.TIME_TO, '07:00 PM', timetable));
        }
      } else if (index + 1 === self.length && timetable.TIME_TO !== '07:00 PM' && timetable.ROOM.toUpperCase().indexOf('LAB') !== -1) {
        ttWithFreeSlots.push(timetable);
        // Only show Free slot before 09:30 PM
        if (Date.parse(timetable.DATESTAMP_ISO.split('-').join('/') + ' ' + timetable.TIME_TO)
          < Date.parse(timetable.DATESTAMP_ISO.split('-').join('/') + ' ' + '07:00 PM')) {
          ttWithFreeSlots.push(this.freeSlots(timetable.TIME_TO, '07:00 PM', timetable));
        }
      } else if (index + 1 !== self.length && timetable.TIME_TO !== '09:30 PM' && timetable.DAY !== self[index + 1].DAY) {
        ttWithFreeSlots.push(timetable);
        // Only show Free slot before 09:30 PM
        if (Date.parse(timetable.DATESTAMP_ISO.split('-').join('/') + ' ' + timetable.TIME_TO)
          < Date.parse(timetable.DATESTAMP_ISO.split('-').join('/') + ' ' + '09:30 PM')) {
          ttWithFreeSlots.push(this.freeSlots(timetable.TIME_TO, '09:30 PM', timetable));
        }
      } else if (index + 1 === self.length && timetable.TIME_TO !== '09:30 PM') {
        ttWithFreeSlots.push(timetable);
        // Only show Free slot before 09:30 PM
        if (Date.parse(timetable.DATESTAMP_ISO.split('-').join('/') + ' ' + timetable.TIME_TO)
          < Date.parse(timetable.DATESTAMP_ISO.split('-').join('/') + ' ' + '09:30 PM')) {
          ttWithFreeSlots.push(this.freeSlots(timetable.TIME_TO, '09:30 PM', timetable));
        }
      } else {
        ttWithFreeSlots.push(timetable);
      }
    });
    return ttWithFreeSlots;
  }

  freeSlots(timeFrom: string, timeTo: string, timetable: StudentTimetable) {
    return {
      INTAKE: '',
      MODID: 'FREE',
      DAY: timetable.DAY,
      LOCATION: timetable.LOCATION,
      ROOM: timetable.ROOM,
      LECTID: '',
      NAME: '',
      SAMACCOUNTNAME: '',
      DATESTAMP: timetable.DATESTAMP,
      DATESTAMP_ISO: timetable.DATESTAMP_ISO,
      TIME_FROM: timeFrom,
      TIME_TO: timeTo,
      GROUPING: ''
    };
  }

}
