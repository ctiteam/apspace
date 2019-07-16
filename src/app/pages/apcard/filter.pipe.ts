import { Pipe, PipeTransform } from '@angular/core';
import { Apcard } from 'src/app/interfaces';

const filterMap = {
    credit: (apcard: Apcard) => apcard.ItemName === 'Top Up',
    debit: (apcard: Apcard) => apcard.ItemName !== 'Top Up'
};

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(items: Apcard[] | null, visibleOption: VisibleOption): Apcard[] {
    if (visibleOption !== 'all') {
        items = items.filter(item => filterMap[visibleOption](item));
    }

    return items;
  }
}

@Pipe({ name: 'monthFilter' })
export class MonthFilter implements PipeTransform {
    transform(items: any[], month: string) {
        if (month) {
            return [month];
        }

        return items;
    }
}

@Pipe({ name: 'yearFilter' })
export class YearFilter implements PipeTransform {
    transform(items: any, year: string) {
        if (year) {
            return [year];
        }

        return items;
    }
}
