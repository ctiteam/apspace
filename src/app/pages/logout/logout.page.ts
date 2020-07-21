import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { tap } from 'rxjs/operators';

import { DataCollectorService, NotificationService, SettingsService } from '../../services';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    private settings: SettingsService,
    private notification: NotificationService,
    private dc: DataCollectorService,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Please wait...',
      translucent: true,
    }).then(loading => {
      loading.present();
      if (this.platform.is('cordova')) {
        this.notification.sendTokenOnLogout().pipe(
          tap(_ => this.dc.logout().subscribe())
        ).
          subscribe(
            {
              complete: () => {
                this.settings.clear();
                this.storage.clear();
                this.navCtrl.navigateRoot('/login', { replaceUrl: true });
              }
            }
          ); // works only on phones
      } else {
        this.settings.clear();
        this.storage.clear();
        this.navCtrl.navigateRoot('/login', { replaceUrl: true });
      }
      // destroy all cached/active views which angular router does not
      loading.dismiss();
    });
  }

}
