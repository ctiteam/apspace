import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  ) {}

  ionViewDidLoad(){
    this.itemDetails = this.navParams.get('itemDetails');
  }

  sanitize(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  displayDate(message_id) {
    let date = this.notification.timeConverter(message_id);
    return date[1];
  }
}
