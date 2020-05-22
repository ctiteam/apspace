import { Pipe, PipeTransform } from '@angular/core';

/**
 * Color hex converter.
 */
@Pipe({
  name: 'strToColor'
})
export class StrToColorPipe implements PipeTransform {

  /**
   * Convert string to color with djb2 hash function.
   */
  transform(str: string): string {
    let hash = 5381;
    /* tslint:disable:no-bitwise */
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return '#' + [16, 8, 0].map(i => ('0' + (hash >> i & 0xFF).toString(16))
      .substr(-2)).join('');
    /* tslint:enable:no-bitwise */
  }

}
