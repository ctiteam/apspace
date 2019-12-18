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
        r => r.RELATIONTYPE.toLowerCase().includes(filter.toLowerCase())
      );
    }
  }
}
