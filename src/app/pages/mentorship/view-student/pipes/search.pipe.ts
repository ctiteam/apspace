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
            || r.CREDIT_HOURS.toLowerCase().includes(search.toLowerCase())
            || r.MODULE_NAME.toLowerCase().includes(search.toLowerCase())
            || r.TOTAL_CLASS.toString().toLowerCase().includes(search.toLowerCase())
            || r.TOTAL_ATTEND_PERCENT.toString().includes(search.toLowerCase())
      );
    }
  }

}
