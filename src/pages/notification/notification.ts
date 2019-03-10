import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { App, IonicPage, NavParams, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { finalize, map } from 'rxjs/operators';

import { NotificationProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})

export class NotificationPage {
  objectKeys = Object.keys;

  testRes = {
    "history": {
      "Academic Related": {
        "firstColor": "#920383",
        "secondColor": "red",
        "items": [
          {
            "content": "<h1>HTML BIG</h1>",
            "message_id": 1551948044.0390005,
            "read": true,
            "staff_id": "iconsult",
            "staff_name": "iConsult Messaging User",
            "title": "HELLO iConsult Messaging UseriConsult Messaging UseriConsult Messaging User iConsult Messaging UseriConsult Messaging UseriConsult Messaging User iConsult Messaging User"
          },
          {
            "content": "<h1>HTML BIG</h1>",
            "message_id": 1551858238.0925581,
            "read": false,
            "staff_id": "iconsult",
            "staff_name": "iConsult Messaging User",
            "title": "HELLO"
          },
          {
            "content": "<h1>HTML BIG</h1>",
            "message_id": 1550646154.0458324,
            "read": false,
            "staff_id": "iconsult",
            "staff_name": "iConsult Messaging User",
            "title": "HELLO"
          },
          {
            "content": "<h1>HTML BIG</h1>",
            "message_id": 1551948044.0390005,
            "read": true,
            "staff_id": "iconsult",
            "staff_name": "iConsult Messaging User",
            "title": "HELLO"
          },
          {
            "content": "<h1>HTML BIG</h1>",
            "message_id": 1551858238.0925581,
            "read": false,
            "staff_id": "iconsult",
            "staff_name": "iConsult Messaging User",
            "title": "HELLO"
          },
          {
            "content": "<h1>HTML BIG</h1>",
            "message_id": 1550646154.0458324,
            "read": false,
            "staff_id": "iconsult",
            "staff_name": "iConsult Messaging User",
            "title": "HELLO"
          },
          {
            "content": "<h1>HTML BIG</h1>",
            "message_id": 1551948044.0390005,
            "read": true,
            "staff_id": "iconsult",
            "staff_name": "iConsult Messaging User",
            "title": "HELLO"
          },
          {
            "content": "<h1>HTML BIG</h1>",
            "message_id": 1551858238.0925581,
            "read": false,
            "staff_id": "iconsult",
            "staff_name": "iConsult Messaging User",
            "title": "HELLO"
          },
          {
            "content": "<h1>HTML BIG</h1>",
            "message_id": 1550646154.0458324,
            "read": false,
            "staff_id": "iconsult",
            "staff_name": "iConsult Messaging User",
            "title": "HELLO"
          },
          {
            "content": "<h1>HTML BIG</h1>",
            "message_id": 1551948044.0390005,
            "read": true,
            "staff_id": "iconsult",
            "staff_name": "iConsult Messaging User",
            "title": "HELLO"
          },
          {
            "content": "<h1>HTML BIG</h1>",
            "message_id": 1551858238.0925581,
            "read": false,
            "staff_id": "iconsult",
            "staff_name": "iConsult Messaging User",
            "title": "HELLO"
          },
          {
            "content": "<h1>HTML BIG</h1>",
            "message_id": 1550646154.0458324,
            "read": false,
            "staff_id": "iconsult",
            "staff_name": "iConsult Messaging User",
            "title": "HELLO"
          },
          {
            "content": "<h1>HTML BIG</h1>",
            "message_id": 1551948044.0390005,
            "read": true,
            "staff_id": "iconsult",
            "staff_name": "iConsult Messaging User",
            "title": "HELLO"
          },
          {
            "content": "<h1>HTML BIG</h1>",
            "message_id": 1551858238.0925581,
            "read": false,
            "staff_id": "iconsult",
            "staff_name": "iConsult Messaging User",
            "title": "HELLO"
          },
          {
            "content": "<h1>HTML BIG</h1>",
            "message_id": 1550646154.0458324,
            "read": false,
            "staff_id": "iconsult",
            "staff_name": "iConsult Messaging User",
            "title": "HELLO"
          }
        ]
      },
      "General": {
        "firstColor": "blue",
        "secondColor": "black",
        "items": [{
          "content": "\n                    Please be reminded that your fees of RM22860 is due for payment.\n\n                    You can make the payment at the Cashier Counter during office hours or via online to APU bank account as per bank details below. Kindly email the payment copy to bursary@apu.edu.my for verification:\n\n                    ACCOUNT DETAILS:\n\n                    A/C Name:\n                    ASIA PACIFIC UNIVERSITY SDN BHD\n\n                    Bank:\n                    MALAYAN BANKING BERHAD\n\n                    Address:\n                    Lot No. G-1 & G-2, Ground Floor,\n                    Support Service Building, Technology Park Malaysia\n                    Bukit Jalil, Kuala Lumpur, 57000, Malaysia\n\n                    Account No in USD:\n                    714413000532 (If paying in USD)\n\n                    Account No in RM:\n                    514413-500658 (If paying in RM)\n\n                    Swift Code:\n                    MBBEMYKL\n\n                    Ref: Student Name & ID No.\n\n                    Thank you.\n\n                    Regards,\n                    APU Bursary Services",
          "message_id": 1550137402.0089228,
          "read": false,
          "staff_id": "NA",
          "staff_name": "Bursary Notifications",
          "title": "Outstanding Fees"
        }]
      },
    }
  }

  notifications = 'unread';
  unreadMessages: any;

  message$: Observable<any>;

  numOfSkeletons = new Array(5);
  isLoading: boolean;
  cordova: boolean;

  constructor(
    private navParams: NavParams,
    private notification: NotificationProvider,
    private platform: Platform,
    private sanitizer: DomSanitizer,
    public app: App,
  ) { }

  ionViewDidEnter() {
    if (this.platform.is('cordova')) {
      this.doRefresh();
    }
  }

  ionViewDidLeave() {
    if (this.platform.is('cordova')) {
      const callback = this.navParams.get('callback');
      if (callback) {
        callback();
      }
    }
  }

  doRefresh(refresher?) {
    this.cordova = true;
    this.isLoading = true;
    this.message$ = this.notification.getMessage().pipe(
      map(res => res.history),
      finalize(() => { refresher && refresher.complete(), this.isLoading = false; }),
    );
  }

  openBasicModal(item: any, messageID: string) {
    this.notification.sendRead(messageID).subscribe();
    this.app.getRootNav().push('NotificationModalPage', { itemDetails: item });
  }

  displayDate(msgId) {
    const date = this.notification.timeConverter(msgId);
    return date[0];
  }

  sanitize(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
