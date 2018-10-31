import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import { Trips } from '../../interfaces';

/**
 * Filter next trip for bus tracking.
 */
@Pipe({ name: 'nextTrip' })
export class TripNextPipe implements PipeTransform {
  /**
   * Filter trips for given trip time.
   *
   * @param ts - trips
   */
  transform(ts: Trips[]): string | null {
    const date = new Date();
    const now = +`${date.getHours()}${date.getMinutes()}`;
    const nextTrip = ts.find(trip => now <= +trip.trip_time.replace(':', ''));

    if (nextTrip) {
      const [hour, minute] = nextTrip.trip_time.split(':');
      date.setHours(+hour, +minute);
      return new DatePipe('en').transform(date, 'H:mm');
    }
    return null;
  }
}
