import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { finalize, map, tap } from 'rxjs/operators';

import { NotificationProvider, LoadingControllerProvider } from '../../providers';
import { stringify } from 'querystring';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})

export class NotificationPage {

  notifications = 'all';
  unreadMessages: any;

  message$: Observable<any>;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private notification: NotificationProvider,
    private platform: Platform,
    private loading: LoadingControllerProvider,
    private sanitizer: DomSanitizer,
  ) { }

  ionViewDidEnter() {
    if (this.platform.is('cordova')) {
      this.doRefresh();
    }
  }

  ionViewDidLeave() {
    let callback = this.navParams.get("callback");
    if (callback) {
      callback();
    }
  }

  doRefresh(refresher?) {
    this.loading.presentLoading();
    this.message$ = this.notification.getMessage().pipe(
      map(res => res["history"]),
      finalize(() => { refresher && refresher.complete(), this.loading.dismissLoading() })
    )
  }

  openBasicModal(item: any, messageID: string) {
    this.notification.sendRead(messageID).subscribe();
    this.navCtrl.push('NotificationModalPage', { itemDetails: item });
  }

  displayDate(message_id) {
    let date = this.notification.timeConverter(message_id);
    return date[0];
  }

  sanitize(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
