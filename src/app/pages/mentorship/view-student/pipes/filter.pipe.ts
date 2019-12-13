import { Pipe, PipeTransform } from '@angular/core';
import { Subcourse } from 'src/app/interfaces/mentorship';

const filterMap = {
  'low-attendance': (item: Subcourse) => item.TOTAL_ATTEND_PERCENT < 80,
  // tslint:disable-next-line: object-literal-key-quotes
  'passed': (item: Subcourse) => item.GRADE_POINT > '2.0'
};

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(result: Subcourse[] | null, shownFilters: string[]): Subcourse[] {
    if (shownFilters && shownFilters.length > 0) {
      return (result || []).filter((item: Subcourse) => {
        return shownFilters.some(
          label =>
            filterMap[label.toLowerCase().trim()] &&
            filterMap[label.toLowerCase().trim()](item)
        );
      });
    }

    // Fallback
    return result;
  }
}
