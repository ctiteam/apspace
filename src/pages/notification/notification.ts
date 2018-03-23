import { Component, NgZone } from '@angular/core';
import { IonicPage, Platform, AlertController, ToastController, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Firebase } from "@ionic-native/firebase";

import { WsApiProvider } from '../../providers/ws-api/ws-api';
import { NotificationServiceProvider } from '../../providers/notification-service/notification-service';
import { CasTicketProvider } from '../../providers/cas-ticket/cas-ticket';
import { LoginPage } from '../login/login';

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
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private navCtrl: NavController,
    private notificationService: NotificationServiceProvider,
  ) {
    // let notification = this.navParams.get('data');
    // if (notification.title != '')
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
        if (this.items.length > 5) {
          this.items.pop();
        }
      })
    });
  }

  openBasicModal(item) {
    this.navCtrl.push('NotificationModalPage', { itemDetails: item });
  }
}
