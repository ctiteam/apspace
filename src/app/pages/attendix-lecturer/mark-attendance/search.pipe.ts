import { Pipe, PipeTransform } from '@angular/core';
import { Status } from './status.interface';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(students: Status[], term: string): any {
    if (term) {
      return students.filter(student =>
        student.name.toLowerCase().includes(term.toLowerCase())
        || student.id.includes(term.toUpperCase())
      );
    } else {
      return students;
    }
  }

}
