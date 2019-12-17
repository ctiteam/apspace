import { Pipe, PipeTransform } from '@angular/core';
import { Subcourse } from 'src/app/interfaces/mentorship';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(results: Subcourse[], search: string): Subcourse[] {
    if (!search) {
      return results;
    } else {
      return results.filter(
        r => r.MODULE_CODE.toLowerCase().includes(search.toLowerCase())
      );
    }
  }

}
