import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import { NotificationServiceProvider } from '../../providers';
import { Notification } from '../../interfaces';
import { finalize, tap, map } from '../../../node_modules/rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})

export class NotificationPage {

  message$: Observable<any>;
  messages: any;

  constructor(
    private navCtrl: NavController,
    private notification: NotificationServiceProvider,
    private platform: Platform,
    private storage: Storage,
  ) { }

  ionViewDidLoad() {
    if (this.platform.is('cordova')) {
      this.doRefresh();
    }
  }

  doRefresh(refresher?) {
    this.message$ = this.notification.getMessage().pipe(
      map(res => res["history"]),
      finalize(() => refresher && refresher.complete())
    )
  }

  openBasicModal(item: any, messageID: string) {
    this.notification.sendRead(messageID).subscribe();
    this.navCtrl.push('NotificationModalPage', { itemDetails: item });
  }
}
