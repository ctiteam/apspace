import { Pipe, PipeTransform } from '@angular/core';
import { NotificationBody } from 'src/app/interfaces';

@Pipe({
  name: 'notificationCategory'
})
export class NotificationCategoryPipe implements PipeTransform {

  /**
   * Filter notification page by category.
   *
   * @param notifications Array of notifications
   * @param categories array of categories
   */
  transform(notifications: NotificationBody[], categories: string[]): any {
    // tslint:disable-next-line: prefer-const
    let results: NotificationBody[] = [];

    categories.forEach(category => {
      notifications.forEach(notification => {
        if (notification.category === category) {
          results.push(notification);
        }
      });
    });
    return results;
  }
}
