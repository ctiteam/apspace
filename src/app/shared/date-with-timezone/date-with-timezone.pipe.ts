import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import { SettingsService } from 'src/app/services';

@Pipe({
  name: 'dateWithTimezone'
})
export class DateWithTimezonePipe implements PipeTransform {

  enableMalaysiaTimezone: boolean;

  constructor(private settings: SettingsService) {
    this.settings.get$('enableMalaysiaTimezone').subscribe(value =>
      this.enableMalaysiaTimezone = value
    );
  }

  transform(date: any, format: string = 'yyyy-MM-dd') {
    const timezone = this.enableMalaysiaTimezone ? '+0800' : '';

    return new DatePipe('en-US').transform(date, format, timezone);
  }

}
