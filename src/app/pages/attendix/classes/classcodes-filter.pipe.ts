import { Pipe, PipeTransform } from '@angular/core';
import { differenceInDays, parse, parseISO } from 'date-fns';

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
        && differenceInDays(today, parseISO(classcode.DATE)) <= timeframe
      ).sort((a, b) => {
        // same date => sort DESC by start time
        if (parseISO(b.DATE).getTime() === parseISO(a.DATE).getTime()) {
          return parse(b.TIME_FROM, 'h:mm a', new Date()).getTime()
            - parse(a.TIME_FROM, 'h:mm a', new Date()).getTime();
        }
        // sort DESC by date
        return parseISO(b.DATE).getTime() - parseISO(a.DATE).getTime();
      });
  }

}
