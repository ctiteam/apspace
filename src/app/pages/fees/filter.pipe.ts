import { Pipe, PipeTransform } from "@angular/core";

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

@Pipe({ name: "filter" })
export class FilterPipe implements PipeTransform {
  transform(items: Item[] | null, visibleLabels: string[]): Item[] {
    console.log("hi");

    if (visibleLabels) {
      return (items || []).filter((item: Item) =>
        visibleLabels
          .map(
            label =>
              filterMap[label.toLowerCase()] &&
              filterMap[label.toLowerCase()](item)
          )
          .some(value => value === true)
      );
    }

    return items;
  }
}
