import { Pipe, PipeTransform } from '@angular/core';

/**
 * Reverse array.
 */
@Pipe({ name: 'rev' })
export class ReversePipe implements PipeTransform {
  /**
   * Return a new reversed array.
   *
   * @param array - array to be reversed
   */
  transform<T>(array: T[]): T[] {
    return array.slice().reverse();
  }
}
