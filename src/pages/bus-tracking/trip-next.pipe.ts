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
  transform(ts: Trips[] | null): Trips[] {
    return ts;
  }
}
