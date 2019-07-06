import { Pipe, PipeTransform } from '@angular/core';

interface Item {
  AMOUNT_PAYABLE: number;
  TOTAL_COLLECTED: number;
  OUTSTANDING: number;
  FINE: number;
}

const filterMap = {
  paid: (item: Item) => item.TOTAL_COLLECTED === item.AMOUNT_PAYABLE,
  outstanding: (item: Item) => item.OUTSTANDING > 0,
  overdue: (item: Item) => item.OUTSTANDING > 0,
  fine: (item: Item) => item.FINE > 0
};

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(items: Item[] | null, visibleLabels: string[]): Item[] {
    if (visibleLabels) {
      return (items || []).filter((item: Item) =>
        visibleLabels.some(
          label =>
            filterMap[label.toLowerCase()] &&
            filterMap[label.toLowerCase()](item)
        )
      );
    }

    return items;
  }
}
