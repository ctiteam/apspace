import { Pipe, PipeTransform } from '@angular/core';

import { Status } from '../../../../generated/graphql';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(students: Partial<Status>[], term: string): Partial<Status>[] {
    if (term) {
      const upperTerm = term.toUpperCase();
      return students.filter(student =>
        student.name.toUpperCase().includes(upperTerm)
        || student.id.includes(upperTerm)
      );
    } else {
      return students;
    }
  }

}
