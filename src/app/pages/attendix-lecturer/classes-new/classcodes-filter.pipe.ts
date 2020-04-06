import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Classcode } from 'src/app/interfaces';

@Pipe({
  name: 'classcodesFilter'
})
export class ClasscodesFilterPipe implements PipeTransform {

  transform(classcodes: Classcode[], keyword: string, timeframe: number) {
    const filteredClasscodes: Classcode[] = JSON.parse(JSON.stringify(classcodes)); // to prevent updating the original object
    if (keyword) { // do this only if the user enters data in search box
      keyword = keyword.toLowerCase().replace(/%/g, '.*')
        .replace(/\(/g, '\\(').replace(/\)/g, '\\)') // escape parenthesis
        .replace(/\{/g, '\\{').replace(/\}/g, '\\}') // escape square bracket
        .replace(/\[/g, '\\[').replace(/\]/g, '\\]'); // escape curly brace
    }
    const searchRegExp = new RegExp(keyword, 'i');
    const today = new Date();
    return filteredClasscodes.filter(classcodeObj => {
      if (searchRegExp.test(classcodeObj.CLASS_CODE.toLowerCase())) { // filter classcode by keyword (using regex)
        const classes = classcodeObj.CLASSES
          .sort((a, b) => moment(b.DATE, 'YYYY-MM-DD').toDate().getTime() - moment(a.DATE, 'YYYY-MM-DD').toDate().getTime())
          .filter(c => moment(today).diff(moment(c.DATE, 'YYYY-MM-DD').subtract(), 'days') <= timeframe);
        if (classes.length > 0) { // filter classes by time frame (last 7, 30, or 98 days).
          classcodeObj.CLASSES = classes;
          return true;
        }
      }

    });
  }

}
