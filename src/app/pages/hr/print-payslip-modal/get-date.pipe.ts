import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getDate'
})
export class GetDatePipe implements PipeTransform {

  transform(value: string): string {
    const date = value.split('.', 2)[1].replace(/-End Month|-EndMonth/g, '');
    return date;
  }

}
