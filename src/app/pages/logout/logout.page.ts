import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { SettingsService } from '../../services';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    private settings: SettingsService
  ) { }

  ngOnInit() {
    this.settings.clear();
    this.storage.clear();
    // destroy all cached/active views which angular router does not
    this.navCtrl.navigateRoot('/login', { replaceUrl: true });
  }

}
