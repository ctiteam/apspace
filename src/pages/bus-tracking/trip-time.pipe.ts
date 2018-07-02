import { Pipe, PipeTransform } from '@angular/core';

import { Trips } from '../../interfaces';

/**
 * Filter trips for bus tracking.
 */
@Pipe({ name: 'during' })
export class TripTimePipe implements PipeTransform {
  /**
   * Filter trips for given trip time.
   *
   * @param ts - trips to be filtered
   * @param tripFrom - filter trip from if exist
   * @param tripTo - filter trip to if exist
   */
  transform(ts: Trips[], tripFrom: string, tripTo: string): Trips[] {
    return (ts || []).filter(trip => (!tripFrom || trip.trip_from === tripFrom)
                                  && (!tripTo || trip.trip_to === tripTo));
  }
}
