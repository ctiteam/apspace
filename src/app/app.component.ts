import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { SettingsService, UserSettingsService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  darkThemeActivated = false;
  pureDarkThemeActivated = false;
  selectedAccentColor = 'blue-accent-color';

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    public storage: Storage,
    private settings: SettingsService,
    private userSettings: UserSettingsService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // this.settings.ready();

    // this.platform.ready().then(() => {
    //   this.statusBar.styleDefault();
    // });
    // platform required to be ready before everything else
    this.platform
      .ready()
      .then(() => Promise.all([this.settings.ready(), this.storage.get('tgt')]))
      .then(([, tgt]) => {
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
        }
      });
  }
}
