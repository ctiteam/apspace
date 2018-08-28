import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { App, IonicPage, NavParams, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { finalize, map } from 'rxjs/operators';

import { LoadingControllerProvider, NotificationProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})

export class NotificationPage {

  notifications = 'all';
  unreadMessages: any;

  message$: Observable<any>;

  constructor(
    private navParams: NavParams,
    private notification: NotificationProvider,
    private platform: Platform,
    private loading: LoadingControllerProvider,
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
    this.loading.presentLoading();
    this.message$ = this.notification.getMessage().pipe(
      map(res => res.history),
      finalize(() => { refresher && refresher.complete(), this.loading.dismissLoading(); }),
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
