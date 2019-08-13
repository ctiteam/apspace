/** Implementation based on ng-fuse. */
import { Pipe, PipeTransform } from '@angular/core';
import * as Fuse from 'fuse.js';

import { MenuItem } from './menu.interface';

/**
 * Better search powered by fuse.
 */
@Pipe({
  name: 'fuse'
})
export class FusePipe implements PipeTransform {

  /**
   * Menu items fuzzy search, return all if search term empty.
   *
   * @param menuItems - array of menu item
   * @param term - search term
   * @returns searched - searched items
   */
  transform(menuItems: MenuItem[], term: string): MenuItem[] {
    if (term !== '') {
      const options: Fuse.FuseOptions<MenuItem> = {
        keys: ['title', 'color', 'tags'],
      };
      const fuse = new Fuse(menuItems, options);
      return fuse.search(term);
    } else {
      return menuItems;
    }
  }

}
