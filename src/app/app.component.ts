import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { SettingsService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private settings: SettingsService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.settings.ready();

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
  }
}
