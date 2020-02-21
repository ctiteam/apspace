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
  // FORCE +08
  transform(value: any, format?: string, offset ?: string) {
    if (format !== 'h:mm a' && format !== 'HH:mm') { // The best statement to make all this work
      return formatDate(value, format, 'en-US', offset); // Fast quit
    }

    // Here comes the Magic
    return formatDate(value, this.activeTimeFormat === '12-hours' ? 'h:mm a' : 'HH:mm', 'en-US', offset);
  }
}
