import { Pipe, PipeTransform } from '@angular/core';
import { NotificationBody } from 'src/app/interfaces';

/**
 * Filter notifications to unread notifications only.
 */
@Pipe({
  name: 'unreadMessagesOnly'
})
export class UnreadMessagesOnlyPipe implements PipeTransform {

  /**
   * Filter notification page by unread/read notifications.
   *
   * @param notifications Array of notifications
   * @param showUnreadOnly boolean value that indecates if user wants to see unread message only or not
   */
  transform(notifications: NotificationBody[], showUnreadOnly: boolean): any {
    return showUnreadOnly ? notifications.filter(notification => notification.read === false) : notifications;
  }

}
