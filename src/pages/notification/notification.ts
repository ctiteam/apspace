import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { finalize, map } from 'rxjs/operators';

import { NotificationProvider, LoadingControllerProvider } from '../../providers';

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

  doRefresh(refresher?) {
    this.loading.presentLoading();
    this.message$ = this.notification.getMessage().pipe(
      map(res => res["history"]),
      finalize(() => {refresher && refresher.complete(), this.loading.dismissLoading()})
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
