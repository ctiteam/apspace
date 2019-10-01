import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { SettingsService, NotificationService } from '../../services';

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
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.settings.clear();
    this.storage.clear();
    this.notification.sendTokenOnLogout(); // works only on phones
    // destroy all cached/active views which angular router does not
    this.navCtrl.navigateRoot('/login', { replaceUrl: true });
  }

}
