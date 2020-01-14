import { Pipe, PipeTransform } from '@angular/core';
import { ExamResit } from 'src/app/interfaces';

@Pipe({
  name: 'moduleFilter'
})
export class ModuleFilterPipe implements PipeTransform {

  transform(modules: ExamResit[], moduleName: string): any {
    if (!moduleName) {
      return null;
    } else {
      return modules.filter(
        module => module.SUBJECT_DESCRIPTION.toLowerCase() === moduleName.toLowerCase()
      );
    }
  }

}
