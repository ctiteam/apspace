import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificationProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-notification-modal',
  templateUrl: 'notification-modal.html',
})
export class NotificationModalPage {

  itemDetails: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    private notification: NotificationProvider,
  ) { }

  ionViewDidLoad() {
    this.itemDetails = this.navParams.get('itemDetails');
  }

  sanitize(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  displayDate(msgId) {
    const date = this.notification.timeConverter(msgId);
    return date[1];
  }
}
