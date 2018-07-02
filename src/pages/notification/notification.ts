import { Component, NgZone } from '@angular/core';
import { IonicPage, Platform, NavController } from 'ionic-angular';
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})

export class NotificationPage {

  items: { title: string, body: string }[] = [];
  reversed: any;
  token: string;

  constructor(
    private platform: Platform,
    private readonly ngZone: NgZone,
    private readonly storage: Storage,
    private navCtrl: NavController,
  ) {}

  ionViewDidLoad() {
    this.storage.get('items').then(res => {
      if (!res) {
        alert('empty')
      } else {
        this.items.push(res);
        console.log(this.items);
      }
    })
  }

  // handleNotification(notification) {
  //   this.ngZone.run(() => {
  //     this.items.splice(0, 0, { title: notification.title, text: notification.text });
  //     if (this.items.length > 10) {
  //       this.items.pop();
  //     }
  //     this.storage.set('items', this.items);
  //   })
  // }

  openBasicModal(item) {
    this.navCtrl.push('NotificationModalPage', { itemDetails: item });
  }

}
