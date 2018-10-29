import { Pipe, PipeTransform } from '@angular/core';

/**
 * Filter unread messages.
 */
@Pipe({ name: 'unread' })
export class UnreadPipe implements PipeTransform {
  /**
   * @param mm - notiications
   */
  transform(mm: any[] | null): any[] {
    return (mm || []).filter(m => !m.read);
  }
}
