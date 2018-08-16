import { Pipe, PipeTransform } from '@angular/core';


/**
 * Filter day for timetable.
 */
@Pipe({ name: 'unread' })
export class UnreadPipe implements PipeTransform {
  /**
   * asdf
   */
  transform(mm: any[] | null, day: string): any[] {
    return (mm || []).filter(m => !m.read);
  }
}
