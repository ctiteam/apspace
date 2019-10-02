import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { SettingsService, NotificationService, DataCollectorService } from '../../services';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    private settings: SettingsService,
    private notification: NotificationService,
    private dc: DataCollectorService,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.settings.clear();
    this.storage.clear();
    if (this.platform.is('cordova')) {
      this.notification.sendTokenOnLogout().subscribe(); // works only on phones
      this.dc.logout().subscribe();
    }
    // destroy all cached/active views which angular router does not
    this.navCtrl.navigateRoot('/login', { replaceUrl: true });
  }

}
