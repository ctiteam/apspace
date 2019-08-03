import { Pipe, PipeTransform } from '@angular/core';

/**
 * Object length.
 */
@Pipe({
  name: 'length'
})
export class LengthPipe implements PipeTransform {

  /**
   * Get length of object.
   *
   * @param value - object
   * @returns length - length of object
   */
  transform(value: object): number {
    return Object.keys(value).length;
  }

}
