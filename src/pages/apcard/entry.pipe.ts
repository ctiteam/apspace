import { Pipe, PipeTransform } from '@angular/core';

import { Apcard } from '../../interfaces';

/**
 * Filter entries for apcard transactions.
 */
@Pipe({ name: 'for' })
export class EntryPipe implements PipeTransform {
  /**
   * Filter apcard by debit or credit or either.
   *
   * @param tt - apcard transactions
   * @param day - filter entries by 'dr' or 'cr' or ''
   */
  transform(tt: Apcard[] | null, entry: string): Apcard[] {
    if (!entry || !tt) {
      return tt || [];
    } else if (entry === 'cr') {
      return tt.filter(t => t.SpendVal < 0);
    } else if (entry === 'dr') {
      return tt.filter(t => t.SpendVal > 0);
    }
  }
}
