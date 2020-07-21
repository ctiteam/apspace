import { Pipe, PipeTransform } from '@angular/core';

import { MentorshipSubcourse } from 'src/app/interfaces/mentorship';

const filterMap = {
  'low-attendance': (item: MentorshipSubcourse) => item.TOTAL_ATTEND_PERCENT < 80,
  // tslint:disable-next-line: object-literal-key-quotes
  'failed': (item: MentorshipSubcourse) => +item.GRADE_POINT < 2.00 && item.GRADE_POINT !== null,
  'full-attendance': (item: MentorshipSubcourse) => item.TOTAL_ATTEND_PERCENT === 100,
  'full-cgpa': (item: MentorshipSubcourse) => +item.GRADE_POINT === 4.00
};

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(result: MentorshipSubcourse[] | null, shownFilters: string[]): MentorshipSubcourse[] {
    if (shownFilters && shownFilters.length > 0) {
      return (result || []).filter((item: MentorshipSubcourse) => {
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
