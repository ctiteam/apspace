import { Pipe, PipeTransform } from '@angular/core';
import { Classcode } from 'src/app/interfaces';

@Pipe({
  name: 'classcodesFilter'
})
export class ClasscodesFilterPipe implements PipeTransform {

  transform(classcodes: Classcode[], keyword: string): any {
    if (keyword) {
      return classcodes.filter(classcode => classcode.CLASS_CODE.toLowerCase().includes(keyword.toLowerCase()));
    }
    return classcodes;
  }

}
