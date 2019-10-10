import { Injectable } from '@angular/core';
import { Platform, ToastController, NavController } from '@ionic/angular';
import { VersionValidator } from '../interfaces';
import { NavigationExtras } from '@angular/router';
import { tap } from 'rxjs/operators';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { WsApiService } from './ws-api.service';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  // TODO: refactor the service to be used for getting all application data (version, platform, screen size...)
  constructor(
    private plt: Platform,
    private ws: WsApiService,
    private toastCtrl: ToastController,
    private iab: InAppBrowser,
    private navCtrl: NavController
  ) { }

  readonly version = '2.0.2';

  /** Application version name. */
  get name(): string {
    return this.version;
  }

  /** Platform name */
  get platform(): string {
    let platform: string;

    if (this.plt.platforms().find(ele => ele === 'core')) {
      platform = 'browser';
    } else if (this.plt.platforms().find(ele => ele === 'android')) {
      platform = 'Android';
    } else if (this.plt.platforms().find(ele => ele === 'ios')) {
      platform = 'iOS';
    } else if (this.plt.platforms().find(ele => ele === 'windows')) {
      platform = 'Window Mobile';
    } else {
      platform = this.plt.platforms().toString();
    }
    return platform;
  }

  checkForUpdate() {
    return this.ws.get<VersionValidator>('/apspace_mandatory_update.json', true, {
      url: 'https://d370klgwtx3ftb.cloudfront.net',
      auth: false
    })
      .pipe(
        tap(res => {
          let navigationExtras: NavigationExtras;
          const currentAppVersion = this.name;
          const currentAppPlatform = this.platform;
          if (res.maintenanceMode) { // maintenance mode is on
            navigationExtras = {
              state: { forceUpdate: false }
            };
            this.navCtrl.navigateRoot(['/maintenance-and-update'], navigationExtras);
            return;
          } else { // maintenance mode is off
            navigationExtras = {
              state: { forceUpdate: true, storeUrl: '' }
            };
            if (currentAppPlatform === 'Android') { // platform is android
              if (res.android.minimum > currentAppVersion) { // force update
                navigationExtras.state.storeUrl = res.android.url;
                this.navCtrl.navigateRoot(['/maintenance-and-update'], navigationExtras);
                return;
              } else if (res.android.latest > currentAppVersion) { // optional update
                this.presentUpdateToast('A new update for APSpace is available', res.android.url);
              }
            } else if (currentAppPlatform === 'iOS') { // platform is ios
              if (res.ios.minimum > currentAppVersion) { // force update
                navigationExtras.state.storeUrl = res.ios.url;
                this.navCtrl.navigateRoot(['/maintenance-and-update'], navigationExtras);
                return;
              } else if (res.ios.latest > currentAppVersion) { // optional update
                this.presentUpdateToast('Updating the app ensures that you get the latest features', res.ios.url);
              }
            }
          }
        }
        )
      );
  }

  async presentUpdateToast(message: string, url: string) {
    const toast = await this.toastCtrl.create({
      header: 'An Update Available!',
      message,
      duration: 6000,
      position: 'top',
      color: 'primary',
      buttons: [
        {
          icon: 'open',
          handler: () => {
            this.iab.create(url, '_system', 'location=true');
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
}
