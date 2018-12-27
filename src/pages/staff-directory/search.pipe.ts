import { Pipe, PipeTransform } from '@angular/core';

import { StaffDirectory } from '../../interfaces';

/**
 * Search staff for staff directory.
 */
@Pipe({ name: 'search' })
export class SearchPipe implements PipeTransform {
  /**
   * Filter staff directory by search terms.
   *
   * @param sd - staff directory
   * @param term - filter staff name if exists
   */
  transform(sd: StaffDirectory[], term: string): StaffDirectory[] {
    return sd.filter(s => s.FULLNAME.toLowerCase().includes(term.toLowerCase()));
  }
}
