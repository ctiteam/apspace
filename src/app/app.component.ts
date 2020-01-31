import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { Shake } from '@ionic-native/shake/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import {
  ActionSheetController, LoadingController, MenuController, ModalController, NavController,
  Platform, PopoverController, ToastController
} from '@ionic/angular';
import { ShakespearModalPage } from './pages/feedback/shakespear-modal/shakespear-modal.page';
import { NotificationModalPage } from './pages/notifications/notification-modal';
import { CasTicketService, NotificationService, UserSettingsService, VersionService } from './services';

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

  // Shake Feature vars
  loading: HTMLIonLoadingElement;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private cas: CasTicketService,
    private fcm: FCM,
    private feedback: FeedbackService,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private network: Network,
    private notificationService: NotificationService,
    private platform: Platform,
    private popoverCtrl: PopoverController,
    private router: Router,
    private shake: Shake,
    private toastCtrl: ToastController,
    private userSettings: UserSettingsService,
    private notificationService: NotificationService,
    private versionService: VersionService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private menuCtrl: MenuController,
    private popoverCtrl: PopoverController,
    private loadingCtrl: LoadingController,
    private screenshot: Screenshot,
    private vibration: Vibration
  ) {
    this.getUserSettings();
    this.versionService.checkForUpdate().subscribe();
    if (this.platform.is('cordova')) {
      if (this.network.type === 'none') {
        this.presentToast('You are now offline, only data stored in the cache will be accessable.', 6000);
      }
      this.runCodeOnReceivingNotification(); // notifications
      // if (this.platform.is('ios')) {
      //   this.statusBar.overlaysWebView(false); // status bar for ios
      // }

      // FOR TESTING PURPOSE
      // this.statusBar.backgroundColorByHexString('#000000');
      // this.statusBar.backgroundColorByName('blac k');

      platform.ready().then(() => { // Do not remove this, this is needed for shake plugin to work
        this.shake.startWatch(40).subscribe(async () => { // "shaked" the phone, "40" is the sensitivity of the shake. The lower the better!
          if (!await this.cas.isAuthenticated()) {
            return; // Do nothing if they aren't logged in
          }

          if (this.router.url.startsWith('/feedback')) {
            return;
          }

          this.screenshot.URI(80).then(async (res) => {
            this.vibration.vibrate(1000); // Vibrate for 1s (1000ms)
            const modal = await this.modalCtrl.create({
              component: ShakespearModalPage,
              cssClass: 'controlled-modal',
              componentProps: {
                imagePath: res.URI
              }
            });

            await modal.present();
          });
        });
      });

      this.platform.backButton.subscribe(async () => { // back button clicked
        if (this.router.url.startsWith('/tabs') || this.router.url.startsWith('/maintenance-and-update')) {
          const timePressed = new Date().getTime();
          if ((timePressed - this.lastTimeBackPress) < this.timePeriodToExit) {
            // tslint:disable-next-line: no-string-literal
            navigator['app'].exitApp();
          } else {
            this.presentToast('Press again to exit App', 3000);
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

  async presentToast(msg: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration,
      color: 'medium',
      position: 'top',
      showCloseButton: true
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

  // this will fail when the user opens the app for the first time and login because it will run before login
  // => we need to call it here and in login page as well
  runCodeOnReceivingNotification() {
    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) { // Notification received in background
        this.openNotificationModal(data);
      } else { // Notification received in foreground
        this.showNotificationAsToast(data);
      }
    });
  }

  async showNotificationAsToast(data: any) {
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

  getUserSettings() {
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
  }

}
