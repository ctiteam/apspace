import { Pipe, PipeTransform } from '@angular/core';

import { LeaveHistory } from 'src/app/interfaces';

@Pipe({
  name: 'sortByDate'
})
export class SortByDatePipe implements PipeTransform {

  transform(history: LeaveHistory[]): LeaveHistory[] {
    if (history.length > 1) {
      return this.sortByKey(history, 'LEAVE_DATE');
    }
    return null;
  }

  sortByKey(array, key) {
    return array.sort((a, b) => {
      const x = new Date(a[key]); const y = new Date(b[key]);
      return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
  }

}
