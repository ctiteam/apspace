import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { ConsultationSlot } from 'src/app/interfaces';

@Pipe({ name: 'validateCheckbox' })
export class ValidateCheckboxPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(slot: ConsultationSlot) {
    return new Date(this.datePipe.transform(slot.start_time, 'medium', '+0800'))
      > moment(new Date()).add(24, 'hours').toDate();
  }
}
