/** Implementation based on ng-fuse. */
import { Pipe, PipeTransform } from '@angular/core';
import * as Fuse from 'fuse.js';

import { MenuItem } from './menu.interface';

@Pipe({
  name: 'fuse'
})
export class FusePipe implements PipeTransform {

  transform(menuItems: MenuItem[], term: string): any {
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
