import { Component } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { Platform, ToastController, NavController, ModalController, MenuController, ActionSheetController, PopoverController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { UserSettingsService } from './services';
import { Router } from '@angular/router';

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
    private popoverCtrl: PopoverController
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
      if (this.platform.is('ios')) {
        this.statusBar.overlaysWebView(false);
      }
      // if (this.network.type === 'none') {
      //   this.toastCtrl
      //     .create({
      //       message: 'You are now offline.',
      //       duration: 3000,
      //       position: 'top',
      //     })
      //     .present();
      // }

      this.platform.backButton.subscribe(async () => {
        // get all possible intents

        const getActionSheet = await this.actionSheetCtrl.getTop();
        const getPopover = await this.popoverCtrl.getTop();
        const getModal = await this.modalCtrl.getTop();
        const getMenu = await this.menuCtrl.getOpen();

        try {
          if (getActionSheet) {
            getActionSheet.dismiss();
          }
        } catch (error) { }

        try {
          if (getPopover) {
            getPopover.dismiss();
          }
        } catch (error) { }

        try {
          if (getModal) {
            getModal.dismiss();
          }
        } catch (error) { }

        try {
          if (getMenu) {
            getMenu.close();
          }
        } catch (error) { }

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
          this.navCtrl.back();
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
}
