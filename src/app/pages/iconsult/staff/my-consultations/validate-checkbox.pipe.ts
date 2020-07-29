import { Pipe, PipeTransform } from '@angular/core';
import { add } from 'date-fns';

import { ConsultationSlot } from 'src/app/interfaces';
import { DateWithTimezonePipe } from 'src/app/shared/date-with-timezone/date-with-timezone.pipe';

@Pipe({ name: 'validateCheckbox' })
export class ValidateCheckboxPipe implements PipeTransform {
  constructor(private dateWithTimezonePipe: DateWithTimezonePipe) {}

  transform(slot: ConsultationSlot) {
    return new Date(this.dateWithTimezonePipe.transform(slot.start_time, 'medium'))
      > add(new Date(), {hours: 24});
  }
}
