import { Pipe, PipeTransform } from '@angular/core';

/**
 * Plain simple urldecode to replace `&amp;`.
 */
@Pipe({ name: 'urldecode' })
export class UrldecodePipe implements PipeTransform {
  /**
   * Replace `&amp;` with `&`.
   *
   * @param str - text to be replaced
   * @return replacedText
   */
  transform(str: string | null): string {
    return str && str.replace('&amp;', '&');
  }
}
