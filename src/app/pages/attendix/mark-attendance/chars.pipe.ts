import { Pipe, PipeTransform } from '@angular/core';

/**
 * Convert string into array of chars.
 */
@Pipe({
  name: 'chars'
})
export class CharsPipe implements PipeTransform {

  /**
   * Split each character in string.
   *
   * @param value Value to be converted to array
   */
  transform(value: string): string[] {
    return value.split('');
  }

}
