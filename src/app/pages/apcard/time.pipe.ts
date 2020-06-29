import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: string): any {
    /**
     * Example: 12:23:22 (Hour:Minute:Second).
     * Return value (slices off last 3 digits, by logic and response seconds is 2 value).
     * 3 slices including ':', so ":22" is being sliced.
     */
    return value.slice(0, -3);
  }

}
