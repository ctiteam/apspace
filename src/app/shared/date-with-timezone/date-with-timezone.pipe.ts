import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import { SettingsService } from 'src/app/services';

@Pipe({
  name: 'dateWithTimezone'
})
export class DateWithTimezonePipe implements PipeTransform {

  enableMalaysiaTimezone: boolean;
  timeFormat: string;

  constructor(private settings: SettingsService) {
    this.settings.get$('enableMalaysiaTimezone').subscribe(value =>
      this.enableMalaysiaTimezone = value
    );
  }

  transform(date: any, format: string) {
    const timezone = this.enableMalaysiaTimezone ? '+0800' : '';

    if (format === 'time') {
      this.settings.get$('timeFormat').subscribe(value =>
        this.timeFormat = value
      );

      this.timeFormat === '24' ? format = 'HH:mm' : format = 'h:mm aa';
    }

    return new DatePipe('en-US').transform(date, format, timezone);
  }

}
