import { Injectable } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { VersionValidator } from '../interfaces';
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
    private navCtrl: NavController,
    private network: Network,
    private storage: Storage
  ) { }

  readonly version = '2.1.7';

  /** Application version name. */
  get name(): string {
    return this.version;
  }

  /** Platform name */
  get platform(): string {
    if (this.plt.platforms().find(ele => ele === 'core')) {
      return 'browser';
    } else if (this.plt.platforms().find(ele => ele === 'android')) {
      return 'Android';
    } else if (this.plt.platforms().find(ele => ele === 'ios')) {
      return 'iOS';
    } else if (this.plt.platforms().find(ele => ele === 'windows')) {
      return 'Window Mobile';
    } else {
      return this.plt.platforms().toString();
    }
  }

  checkForUpdate() {
    if (this.network.type !== 'none') {
      return this.ws.get<VersionValidator>('/apspace_mandatory_update.json', {
        url: 'https://d370klgwtx3ftb.cloudfront.net',
        auth: false
      }).pipe(
          tap(updateStatus => this.storage.set('updateStatus-cache', updateStatus)),
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
    } else { // get data from local storage if no network only
      return from(this.storage.get('updateStatus-cache'));
    }
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
