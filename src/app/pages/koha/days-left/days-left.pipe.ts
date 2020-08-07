import { Pipe, PipeTransform } from '@angular/core';
import { formatDistance } from 'date-fns';

@Pipe({
  name: 'daysLeft'
})
export class DaysLeftPipe implements PipeTransform {

  transform(value: Date): string {
    const daysLeft = formatDistance(new Date(value), new Date());

    return daysLeft;
  }

}
