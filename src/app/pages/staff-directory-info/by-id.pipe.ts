import { Pipe, PipeTransform } from '@angular/core';

import { StaffDirectory } from '../../interfaces';

/** Find staff. */
@Pipe({
  name: 'byId'
})
export class ByIdPipe implements PipeTransform {

  /**
   * Filter staff directory by id.
   *
   * @param ss - Array of staffs
   * @param id - staff ID
   * @returns Staff
   */
  transform(ss: StaffDirectory[] | null, id: string): StaffDirectory {
    id = id.toLowerCase();
    return (ss || []).find(s => s.ID.toLowerCase() === id);
  }

}
