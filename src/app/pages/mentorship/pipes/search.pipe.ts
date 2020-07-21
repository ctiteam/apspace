import { Pipe, PipeTransform } from '@angular/core';

import { MentorshipStudentList } from 'src/app/interfaces/mentorship';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(results: MentorshipStudentList[], term: string): MentorshipStudentList[] {
    if (term) {
      const searchTerm = term.toUpperCase();
      return results.filter(student =>
        student.INTAKE_CODE.toUpperCase().includes(searchTerm)
        || student.NAME.toUpperCase().includes(searchTerm)
        || student.STUDENT_NUMBER.toUpperCase().includes(searchTerm)
        || student.PROGRAMME.toUpperCase().includes(searchTerm)
      );
    } else {
      return results;
    }
  }

}
