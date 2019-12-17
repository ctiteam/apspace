import { Pipe, PipeTransform } from '@angular/core';
import { Subcourse } from 'src/app/interfaces/mentorship';

const filterMap = {
  'low-attendance': (item: Subcourse) => item.TOTAL_ATTEND_PERCENT < 80,
  // tslint:disable-next-line: object-literal-key-quotes
  'failed': (item: Subcourse) => +item.GRADE_POINT < 2.00 && item.GRADE_POINT !== null,
  'full-attendance': (item: Subcourse) => item.TOTAL_ATTEND_PERCENT === 100,
  'full-cgpa': (item: Subcourse) => +item.GRADE_POINT === 4.00
};

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(result: Subcourse[] | null, shownFilters: string[]): Subcourse[] {
    if (shownFilters && shownFilters.length > 0) {
      return (result || []).filter((item: Subcourse) => {
        return shownFilters.every(
          label =>
            filterMap[label] && filterMap[label](item)
        );
      });
    }

    // Fallback
    return result;
  }
}
