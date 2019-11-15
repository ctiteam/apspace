import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(students: any[], id: string): any {
    if (students.length === 0) {
      return;
    }
    return students.filter(student => student.id.includes(id));
  }

}
