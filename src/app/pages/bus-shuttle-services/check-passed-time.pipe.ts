import { Pipe, PipeTransform } from '@angular/core';
import { parse } from 'date-fns';

import { SettingsService } from 'src/app/services';
import { DateWithTimezonePipe } from 'src/app/shared/date-with-timezone/date-with-timezone.pipe';

@Pipe({
  name: 'checkPassedTime'
})
export class CheckPassedTimePipe implements PipeTransform {

  constructor(private settings: SettingsService, private dateWithTimezonePipe: DateWithTimezonePipe) {}

  transform(passedTime: string): boolean {
    const currentTime = this.dateWithTimezonePipe.transform(new Date(), 'HH:mm');
    const timeFormat = this.settings.get('timeFormat');

    if (timeFormat === '12') {
      const timeObject = parse(passedTime, 'h:mm aa', new Date());
      const formattedPassedTime = this.dateWithTimezonePipe.transform(timeObject, 'HH:mm');

      return currentTime >= formattedPassedTime;
    } else {
      return currentTime >= passedTime;
    }
  }

}
