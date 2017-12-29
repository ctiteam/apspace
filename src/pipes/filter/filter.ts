import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  /** Map value by each function in args. */
  transform(value: any, ...args): any {
    for (let func of args) {
      if (value) {
        value = func(value);
      }
    }
    return value;
  }
}
