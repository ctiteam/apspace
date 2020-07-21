import { Pipe, PipeTransform } from '@angular/core';

import { MenuItem } from './menu.interface';

@Pipe({
  name: 'byItem'
})
export class ByItemPipe implements PipeTransform {

  transform(items: MenuItem[], term: string): any {
    if (term) {
      return items.filter(item => item.title.toLowerCase().includes(term.toLowerCase()));
    }
    return items;
  }

}
