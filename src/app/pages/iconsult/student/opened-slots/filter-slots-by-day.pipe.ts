import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterSlotsByDay' })
export class FilterSlotsByDayPipe implements PipeTransform {
  transform(items: {} | null, date) {
    if (date) {
      return Object.keys(items).filter(key => key.includes(date)).reduce(
        (obj, key) => {
          obj[key] = items[key];
          return obj;
        }, {}
      );
    }
    return items;
  }
}
