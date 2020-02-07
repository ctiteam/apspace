import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { UserSettingsService } from 'src/app/services';

@Pipe({
  name: 'customdatetime'
})
export class CustomDateTimePipe implements PipeTransform {

  activeTimeFormat: '12-hours' | '24-hours';

  constructor(
    private userSettings?: UserSettingsService, // Added '?' because test file was complaining that it can't find the file in constructor
  ) {
    this.userSettings.getTimeFormat().subscribe({
      next: (timeFormat) => this.activeTimeFormat = timeFormat
    });
  }

  // tslint:disable-next-line: no-shadowed-variable
  transform(value: any, format?: string) {
    if (format !== 'h:mm a' && format !== 'HH:mm') { // The best statement to make all this work
      return formatDate(value, format, 'en-US'); // Fast quit
    }

    // Here comes the Magic
    if (this.activeTimeFormat === '12-hours') {
      return formatDate(value, 'h:mm a', 'en-US');
    } else {
      return formatDate(value, 'HH:mm', 'en-US');
    }
  }
}
