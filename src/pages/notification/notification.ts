import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
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
    private readonly storage: Storage,
    private navCtrl: NavController,
  ) {}

  ionViewDidLoad() {
    this.storage.get('items').then(res => {
      if (!res) {
      } else {
        this.items.push(res);
        console.log(this.items);
      }
    })
  }

  openBasicModal(item) {
    this.navCtrl.push('NotificationModalPage', { itemDetails: item });
  }

}
