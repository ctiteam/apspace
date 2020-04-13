import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Classcode } from 'src/app/interfaces';

@Pipe({
  name: 'classcodesFilter'
})
export class ClasscodesFilterPipe implements PipeTransform {

  transform(classcodes: Classcode[], keyword: string, timeframe: number) {
    if (keyword) { // do this only if the user enters data in search box
      keyword = keyword.toLowerCase().replace(/%/g, '.*')
        .replace(/\(/g, '\\(').replace(/\)/g, '\\)') // escape parenthesis
        .replace(/\{/g, '\\{').replace(/\}/g, '\\}') // escape square bracket
        .replace(/\[/g, '\\[').replace(/\]/g, '\\]'); // escape curly brace
    }
    const searchRegExp = new RegExp(keyword, 'i');
    const today = new Date();
    return classcodes
      .filter(classcode => searchRegExp.test(classcode.CLASS_CODE.toLowerCase()))
      .map(classcode => ({ // create a new object to prevent modifying previous object
        ...classcode,
        CLASSES: classcode.CLASSES.slice().filter(c =>
          moment(today).diff(moment(c.DATE, 'YYYY-MM-DD').subtract(), 'days') <= timeframe),
      }))
      .filter(classcode => classcode.CLASSES.length > 0);
  }

}
