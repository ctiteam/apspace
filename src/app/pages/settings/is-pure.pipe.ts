import { Pipe, PipeTransform } from '@angular/core';

/**
 * Check if theme is pure.
 */
@Pipe({ name: 'isPure' })
export class IsPurePipe implements PipeTransform {

  /**
   * Return true if input contains `pure`.
   *
   * param str - theme string
   * @return theme is pure
   */
  transform(str: string | null): boolean {
    return str?.includes('pure');
  }

}
