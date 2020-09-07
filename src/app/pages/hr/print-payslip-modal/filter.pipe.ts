import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO } from 'date-fns';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(files: string[], dateToFilter: string): string[] {
    const formattedDate = dateToFilter ? format(parseISO(dateToFilter), 'yyyy-MM') : dateToFilter;
    const filteredFiles = dateToFilter ? files.filter(file => {
      const date = file.split('.', 2)[1].replace(/-End Month|-EndMonth/g, '');

      return date === formattedDate;
    }) : files;

    return filteredFiles;
  }

}
