import { Pipe, PipeTransform } from '@angular/core';

/**
 * Epoch week converter.
 */
@Pipe({
  name: 'fromWeek'
})
export class FromWeekPipe implements PipeTransform {

  /**
   * Convert week since epoch into seconds since epoch starting from Monday.
   *
   * @param week - week since epoch
   * @return epoch - seconds since epoch
   */
  transform(week: string): number {
    const lastDateOfWeekZero = 315993600000;
    const secondsPerWeek = 604800000;  // 7 * 24 * 60 * 60 * 1000
    const secondsPerDay = 86400000;  // 24 * 60 * 60 * 1000

    // displayed week as Monday (+1d)
    return +week * secondsPerWeek + lastDateOfWeekZero + secondsPerDay;
  }

}
