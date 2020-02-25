import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import {
  ActionSheetController, LoadingController, MenuController, ModalController, NavController,
  Platform, PopoverController, ToastController
} from '@ionic/angular';
import { UserSettingsService, VersionService } from './services';
import { ShakespearFeedbackService } from './services/shakespear-feedback.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  darkThemeActivated = false;
  pureDarkThemeActivated = false;
  selectedAccentColor = 'blue-accent-color';
  shakeSensitivity: number;

  // back button vars
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  // Shake Feature vars
  loading: HTMLIonLoadingElement;

  constructor(
    private network: Network,
    private platform: Platform,
    private router: Router,
    private userSettings: UserSettingsService,
    private versionService: VersionService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private menuCtrl: MenuController,
    private popoverCtrl: PopoverController,
    private loadingCtrl: LoadingController,
    private shakespear: ShakespearFeedbackService
  ) {
    this.versionService.checkForUpdate().subscribe();

    // if (this.platform.is('ios')) {
    //   this.statusBar.overlaysWebView(false); // status bar for ios
    // }

    // FOR TESTING PURPOSE
    // this.statusBar.backgroundColorByHexString('#000000');
    // this.statusBar.backgroundColorByName('black');

    platform.ready().then(() => { // Do not remove this, this is needed for shake plugin to work
      this.getUserSettings();
      if (this.platform.is('cordova')) {
        if (this.network.type === 'none') {
          this.presentToast('You are now offline, only data stored in the cache will be accessable.', 6000);
        }
      }
      this.shakespear.initShakespear(this.shakeSensitivity);
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
            if (this.menuCtrl.getOpen()) {
              this.menuCtrl.close();
              return;
            }

            // tslint:disable-next-line: no-shadowed-variable
            const active = this.actionSheetCtrl.getTop() || this.popoverCtrl.getTop() || this.modalCtrl.getTop();
            if (active) {
              (await active).dismiss();
              return;
            } else {
              this.navCtrl.pop();
            }
          }
        }
      });
    });
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
    this.userSettings
      .getShakeSensitivity()
      .subscribe(val => {
        this.shakeSensitivity = Number(val);
      });
  }

}
