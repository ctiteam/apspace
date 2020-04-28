import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { FlatClasscodev1 } from 'src/app/interfaces';

@Pipe({
  name: 'classcodesFilter'
})
export class ClasscodesFilterPipe implements PipeTransform {

  transform(classcodes: FlatClasscodev1[], keyword: string, timeframe: number) {
    if (keyword) { // do this only if the user enters data in search box
      keyword = keyword.toLowerCase().replace(/%/g, '.*')
        .replace(/\(/g, '\\(').replace(/\)/g, '\\)') // escape parenthesis
        .replace(/\{/g, '\\{').replace(/\}/g, '\\}') // escape square bracket
        .replace(/\[/g, '\\[').replace(/\]/g, '\\]'); // escape curly brace
    }
    const searchRegExp = new RegExp(keyword, 'i');
    const today = new Date();
    return classcodes
      .filter(classcode =>
        searchRegExp.test(classcode.CLASS_CODE.toLowerCase())
        && moment(today).diff(moment(classcode.DATE, 'YYYY-MM-DD').subtract(), 'days') <= timeframe
      ).sort((a, b) => {
        // same date => sort DESC by start time
        if (moment(b.DATE, 'YYYY-MM-DD').toDate().getTime() === moment(a.DATE, 'YYYY-MM-DD').toDate().getTime()) {
          return moment(b.TIME_FROM, 'h:mm A').toDate().getTime() - moment(a.TIME_FROM, 'h:mm A').toDate().getTime();
        }
        // sort DESC by date
        return moment(b.DATE, 'YYYY-MM-DD').toDate().getTime() - moment(a.DATE, 'YYYY-MM-DD').toDate().getTime();
      });
  }

}
