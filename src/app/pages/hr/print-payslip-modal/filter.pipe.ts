import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO } from 'date-fns';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(files: string[], dateToFilter: string, fileToFilter: string): string[] {
    const filteredFiles = dateToFilter || fileToFilter ? files.filter(file => {
      const formattedDate = dateToFilter ? format(parseISO(dateToFilter), 'yyyy-MM') : dateToFilter;

      const date = file.split('.', 2)[1].replace(/-End Month|-EndMonth/g, '');
      const fileCategory = file.split('.')[2];

      if (formattedDate && fileToFilter) {
        return date === formattedDate && fileCategory === fileToFilter;
      } else if (formattedDate) {
        return date === formattedDate;
      } else if (fileToFilter) {
        return fileCategory === fileToFilter;
      }
    }) : files;

    return filteredFiles;
  }
}
