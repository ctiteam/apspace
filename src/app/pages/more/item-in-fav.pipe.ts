import { Pipe, PipeTransform } from '@angular/core';

import { MenuItem } from './menu.interface';

@Pipe({
  name: 'itemInFav'
})
export class ItemInFavPipe implements PipeTransform {

  transform(favMenuItems: MenuItem[], menuItem: MenuItem): any {
    return favMenuItems.some(item => item.title === menuItem.title);
  }

}
