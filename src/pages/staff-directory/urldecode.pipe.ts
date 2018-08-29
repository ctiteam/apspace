import { Pipe, PipeTransform } from '@angular/core';

/**
 * Plain simple urldecode to replace `&amp;`.
 */
@Pipe({ name: 'urldecode' })
export class UrlDecodePipe implements PipeTransform {
  /**
   * Replace `&amp;` with `&`.
   *
   * @param str - text to be replaced
   */
  transform(str: string | null): string {
    return str && str.replace('&amp;', '&');
  }
}
