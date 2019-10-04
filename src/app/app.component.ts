import { Component } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { Platform, ToastController, NavController, ModalController, MenuController, ActionSheetController, PopoverController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { UserSettingsService, NotificationService } from './services';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { NotificationModalPage } from './pages/notifications/notification-modal';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  darkThemeActivated = false;
  pureDarkThemeActivated = false;
  selectedAccentColor = 'blue-accent-color';

  // back button vars
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    public storage: Storage,
    private userSettings: UserSettingsService,
    private toastCtrl: ToastController,
    private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private menuCtrl: MenuController,
    private popoverCtrl: PopoverController,
    private notificationService: NotificationService,
    private fcm: FCM,
  ) {
    this.userSettings.getUserSettingsFromStorage();
    this.userSettings
      .darkThemeActivated()
      .subscribe((val) => {
        this.darkThemeActivated = val;
        this.userSettings.changeStatusBarColor(val);
      });
    this.userSettings
      .PureDarkThemeActivated()
      .subscribe((val) => {
        this.pureDarkThemeActivated = val;
      });
    this.userSettings
      .getAccentColor()
      .subscribe(val => (this.selectedAccentColor = val));

    if (this.platform.is('cordova')) {

      this.runCodeOnReceivingNotification();

      if (this.platform.is('ios')) {
        this.statusBar.overlaysWebView(false);
      }

      this.platform.backButton.subscribe(async () => {

        if (this.router.url.startsWith('/tabs')) {
          const timePressed = new Date().getTime();
          if ((timePressed - this.lastTimeBackPress) < this.timePeriodToExit) {
            // tslint:disable-next-line: no-string-literal
            navigator['app'].exitApp();
          } else {
            this.presentToast('Press again to exit App');
            this.lastTimeBackPress = timePressed;
          }
        } else {
          if (this.menuCtrl.getOpen()) {
            this.menuCtrl.close();
            return;
          }

          const active = this.actionSheetCtrl.getTop() || this.popoverCtrl.getTop() || this.modalCtrl.getTop();

          if (active) {
            (await active).dismiss();
            return;
          } else {
            this.navCtrl.pop();
          }
        }

      });
    }
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // this will fail when the user opens the app for the first time and login because it will run before login
  // => we need to call it here and in login page as well
  runCodeOnReceivingNotification() {
    this.fcm.onNotification().subscribe(data => {
      console.log('notification data: ', data);
      if (data.wasTapped) { // Notification received in background
        this.openNotificationModal(data);
      } else { // Notification received in foreground
        this.presentToastWithOptions(data);
      }
    });
  }

  async presentToastWithOptions(data: any) {
    // need to check with dingdong team about response type
    const toast = await this.toastCtrl.create({
      header: 'New Message',
      message: data.title,
      position: 'top',
      color: 'primary',
      buttons: [
        {
          icon: 'open',
          handler: () => {
            this.openNotificationModal(data);
          }
        }, {
          icon: 'close',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });
    toast.present();
  }

  async openNotificationModal(message: any) {
    // need to check with dingdong team about response type
    const modal = await this.modalCtrl.create({
      component: NotificationModalPage,
      componentProps: { message, notFound: 'No Message Selected' },
    });
    this.notificationService.sendRead(message.message_id).subscribe();
    await modal.present();
    await modal.onDidDismiss();
  }
}
