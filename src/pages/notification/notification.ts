import { Component, NgZone } from '@angular/core';
import { IonicPage, Platform, NavController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Firebase } from "@ionic-native/firebase";

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})

export class NotificationPage {

  items: { title: string, text: string }[] = [];
  reversed: any;
  token: string;

  constructor(
    private platform: Platform,
    private readonly ngZone: NgZone,
    private readonly firebase: Firebase,
    private readonly storage: Storage,
    private navCtrl: NavController,
  ) {
    
    this.platform.ready().then(() => {
      if(this.platform.is('cordova')){
      this.firebase.onNotificationOpen()
        .subscribe(notification => { this.handleNotification(notification) })
      }
    })
  }

  ionViewDidLoad() {
    this.storage.get('items').then(res => {
      if (!res) {
      } else {
        this.items = res;
      }
    })
  }

  handleNotification(notification) {
    this.ngZone.run(() => {
      this.items.splice(0, 0, { title: notification.title, text: notification.text });
      if (this.items.length > 10) {
        this.items.pop();
      }
      this.storage.set('items', this.items);
    })
  }

  openBasicModal(item) {
    this.navCtrl.push('NotificationModalPage', { itemDetails: item });
  }

}
