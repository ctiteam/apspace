import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(value: Array<string[]>): Array<string[]> {
    if (!value) {
      return;
    }

    return value.reverse();
  }

}
