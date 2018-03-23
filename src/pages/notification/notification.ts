import { Component, NgZone } from '@angular/core';
import { IonicPage, Platform, AlertController, ToastController, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Firebase } from "@ionic-native/firebase";


@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})

export class NotificationPage {

  notification: {
    title: string,
    text: string
  } = {
      "title": "",
      "text": ""
    }

  items: { title: string, text: string }[] = [];
  token: string;

  constructor(
    private platform: Platform,
    private readonly ngZone: NgZone,
    private readonly firebase: Firebase,
    private readonly storage: Storage,
    private navCtrl: NavController
  ) {
    this.storage.get('notification').then(data => {
      this.notification = data;
      this.handleNotification(this.notification)
    })


    platform.ready().then(() => {
      this.firebase.onTokenRefresh()
        .subscribe((token: string) => this.token = token);

      this.firebase.onNotificationOpen().subscribe(notification => this.handleNotification(notification));
    });
  }

  handleNotification(data) {
    this.ngZone.run(() => {
      this.items.splice(0, 0, { title: data.title, text: data.text });
      this.storage.set('items', this.items);
      this.storage.get('items').then(data => {
        this.items = data;
        if (this.items.length > 15) {
          this.items.pop();
        }
      })
    });
  }

  openBasicModal(item) {
    this.navCtrl.push('NotificationModalPage', { itemDetails: item });
  }
}
