import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Shake } from '@ionic-native/shake/ngx';
import {
  ActionSheetController, AlertController, LoadingController, MenuController, ModalController, NavController,
  Platform, PopoverController, ToastController
} from '@ionic/angular';
import { NotificationModalPage } from './pages/notifications/notification-modal';
import { CasTicketService, FeedbackService, NotificationService, UserSettingsService, VersionService } from './services';

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
  isOpen = false;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private cas: CasTicketService,
    private feedback: FeedbackService,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private network: Network,
    private notificationService: NotificationService,
    private platform: Platform,
    private popoverCtrl: PopoverController,
    private push: Push,
    private router: Router,
    private shake: Shake,
    private toastCtrl: ToastController,
    private userSettings: UserSettingsService,
    private versionService: VersionService,
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
      // this.statusBar.backgroundColorByName('black');

      platform.ready().then(() => { // Do not remove this, this is needed for shake plugin to work
        this.shake.startWatch(40).subscribe(async () => { // "shaked" the phone, "40" is the sensitivity of the shake. The lower the better!
          if (!await this.cas.isAuthenticated()) {
            return; // Do nothing if they aren't logged in
          }

          if (this.router.url.startsWith('/feedback')) {
            return;
          }

          if (this.isOpen) {
            return;
          }

          this.isOpen = true; // Prevent double alert to be opened
          const alert = await this.alertCtrl.create({
            header: 'Report a problem',
            subHeader: 'Your feedback helps us to improve APSpace',
            inputs: [
              {
                name: 'message',
                type: 'text',
                placeholder: 'Message',
              },
              {
                name: 'contactNo',
                type: 'text',
                placeholder: 'Contact Number (Optional)'
              }
            ],
            buttons: [
              {
                text: 'Dismiss',
                role: 'cancel',
                handler: () => {
                  this.isOpen = false;
                }
              }, {
                text: 'Submit',
                handler: async (data) => {
                  if (!data.message) {
                    this.isOpen = false;
                    return this.toastCtrl.create({
                      // tslint:disable-next-line: max-line-length
                      message: 'Please make sure the Message field is filled up.',
                      position: 'top',
                      color: 'danger',
                      duration: 5000,
                      showCloseButton: true,
                    }).then(toast => toast.present());
                  }

                  // tslint:disable-next-line: no-shadowed-variable
                  const feedback = {
                    contactNo: data.contactNo || '',
                    platform: this.feedback.platform(),
                    message: data.message + '\n' + `Url: ${this.router.url}`,
                    appVersion: this.versionService.version,
                    screenSize: screen.width + 'x' + screen.height,
                  };

                  this.presentLoading();
                  this.feedback.sendFeedback(feedback).subscribe(
                    {
                      next: () => {
                        data.message = '';
                        this.toastCtrl.create({
                          // tslint:disable-next-line: max-line-length
                          message: '<span style="font-weight: bold;">Feedback submitted! </span> The team will get back to you as soon as possbile via Email. Thank you for your feedback',
                          position: 'top',
                          color: 'success',
                          duration: 5000,
                          showCloseButton: true,
                        }).then(toast => toast.present());

                        this.isOpen = false;
                        this.dismissLoading();
                      },
                      error: (err) => {
                        this.isOpen = false;
                        this.toastCtrl.create({
                          message: err.message,
                          cssClass: 'danger',
                          position: 'top',
                          duration: 5000,
                          showCloseButton: true,
                        }).then(toast => toast.present());
                      },
                      complete: () => {
                        this.isOpen = false;
                        this.dismissLoading();
                      }
                    }
                  );
                }
              }
            ]
          });

          alert.present();
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

  checkPushPermission() {
    return this.push.hasPermission().then((res: any) => {
      if (res.isEnabled) {
        this.createPushChannel();
      } else {
        console.log('We do not have permission to send push notifications');
      }
    });
  }

  createPushChannel() {
    this.push.createChannel(
      {
        id: 'apspacepushchannel1',
        description: 'Push channel 1 specifically for android to get messages',
        importance: 3,
        vibration: true
      }
    ).then(() => console.log('channel created for get message'));
  }

  // this will fail when the user opens the app for the first time and login because it will run before login
  // => we need to call it here and in login page as well
  runCodeOnReceivingNotification() {
    this.checkPushPermission();

    const options: PushOptions = {
      android: {},
      ios: {
        alert: 'true',
        badge: 'true',
        sound: 'true'
      }
    };

    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe(data => {
      if (data.additionalData.coldstart) { // Notification received in background
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
