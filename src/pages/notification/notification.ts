import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { NotificationServiceProvider } from '../../providers';
import { Notification } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})

export class NotificationPage {

  items$: Observable<Notification[]>;

  constructor(
    private navCtrl: NavController,
    private notification: NotificationServiceProvider,
    private platform: Platform,
  ) { }

  ionViewDidLoad() {
    if(this.platform.is('cordova')){
      this.items$ = this.notification.getNotificationMessages(true);
    }
  }

  openBasicModal(item) {
    this.navCtrl.push('NotificationModalPage', { itemDetails: item });
  }

}
