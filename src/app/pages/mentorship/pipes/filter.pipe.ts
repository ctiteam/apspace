import { Pipe, PipeTransform } from '@angular/core';
import { Mentorship } from 'src/app/interfaces/mentorship';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(results: Mentorship[], filter: string): Mentorship[] {
    if (!filter) {
      return results;
    } else {
      return results.filter(
        r => r.NAME.toUpperCase().includes(filter.toUpperCase())
            || r.PROGRAMME.toUpperCase().includes(filter.toUpperCase())
            || r.STUDENT_NUMBER.toUpperCase().includes(filter.toUpperCase())
      );
    }
  }
}
