import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modulesFilter'
})
export class ModulesFilterPipe implements PipeTransform {

  transform(modules: any[], keyword: string): any {
    if (keyword) {
      return modules.filter(module => {
        return module.value.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      });
    } else {
      return modules;
    }
  }
}
