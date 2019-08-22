import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'slots' })
export class FilterSlotsPipe implements PipeTransform {
  transform(dates: {} | null, date) {
    if (dates && date) {
      return dates[date];
    }

    return dates;
  }
}
