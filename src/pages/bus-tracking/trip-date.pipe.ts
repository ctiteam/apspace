import { Pipe, PipeTransform } from '@angular/core';

import { Trips } from '../../interfaces';

/**
 * Filter day for bus tracking.
 */
@Pipe({ name: 'on' })
export class TripDatePipe implements PipeTransform {
  /**
   * Filter trips for given day.
   *
   * @param ts - trips
   * @param day - filter trip day if exists
   */
  transform(ts: Trips[] | null, day: string): Trips[] {
    return (ts || []).filter(trip => !day || trip.trip_day === day);
  }
}
