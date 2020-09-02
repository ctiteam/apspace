import { Pipe, PipeTransform } from '@angular/core';
import { parse } from 'date-fns';

import { DateWithTimezonePipe } from 'src/app/shared/date-with-timezone/date-with-timezone.pipe';

@Pipe({
  name: 'timeParser'
})
export class TimeParserPipe extends DateWithTimezonePipe implements PipeTransform {

  transform(time: string): string {
    const timeObject = parse(time, 'h:mm aa', new Date());

    return super.transform(timeObject, 'time');
  }

}
