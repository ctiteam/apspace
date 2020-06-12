import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {
  ActionSheetController, LoadingController, MenuController, ModalController, NavController,
  Platform, PopoverController, ToastController
} from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { VersionValidator } from './interfaces';
import { ApcardPage } from './pages/apcard/apcard.page';
import {
  SettingsService, VersionService, WsApiService
} from './services';
import { ShakespearFeedbackService } from './services/shakespear-feedback.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  theme$: Observable<string>;
  accentColor$: Observable<string>;

  // back button vars
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  // Shake Feature vars
  loading: HTMLIonLoadingElement;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private deeplinks: Deeplinks,
    private iab: InAppBrowser,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private network: Network,
    private platform: Platform,
    private popoverCtrl: PopoverController,
    private router: Router,
    private settings: SettingsService,
    private shakespear: ShakespearFeedbackService,
    private statusBar: StatusBar,
    private toastCtrl: ToastController,
    private version: VersionService,
    private ws: WsApiService,
  ) {
    if (this.network.type !== 'none') {
      this.ws.get<VersionValidator>('/apspace_mandatory_update.json', {
        url: 'https://d370klgwtx3ftb.cloudfront.net',
        auth: false
      }).subscribe(res => {
        let navigationExtras: NavigationExtras;
        const currentAppVersion = this.version.name;
        const currentAppPlatform = this.version.platform;
        if (res.maintenanceMode) { // maintenance mode is on
          navigationExtras = {
            state: { forceUpdate: false }
          };
          this.navCtrl.navigateRoot(['/maintenance-and-update'], navigationExtras);
        } else { // maintenance mode is off
          navigationExtras = {
            state: { forceUpdate: true, storeUrl: '' }
          };
          if (currentAppPlatform === 'Android') { // platform is android
            if (res.android.minimum > currentAppVersion) { // force update
              navigationExtras.state.storeUrl = res.android.url;
              this.navCtrl.navigateRoot(['/maintenance-and-update'], navigationExtras);
            } else if (res.android.latest > currentAppVersion) { // optional update
              this.presentUpdateToast('A new update for APSpace is available', res.android.url);
            }
          } else if (currentAppPlatform === 'iOS') { // platform is ios
            if (res.ios.minimum > currentAppVersion) { // force update
              navigationExtras.state.storeUrl = res.ios.url;
              this.navCtrl.navigateRoot(['/maintenance-and-update'], navigationExtras);
            } else if (res.ios.latest > currentAppVersion) { // optional update
              this.presentUpdateToast('Updating the app ensures that you get the latest features', res.ios.url);
            }
          }
        }
      });
    }

    // if (this.platform.is('ios')) {
    //   this.statusBar.overlaysWebView(false); // status bar for ios
    // }

    // FOR TESTING PURPOSE
    // this.statusBar.backgroundColorByHexString('#000000');
    // this.statusBar.backgroundColorByName('black');

    platform.ready().then(() => { // Do not remove this, this is needed for shake plugin to work
      this.accentColor$ = this.settings.get$('accentColor');

      this.deeplinks.route({
        '/apcard': ApcardPage
      }).subscribe(match => {
        // match.$route - the route we matched, which is the matched entry from the arguments to route()
        // match.$args - the args passed in the link
        // match.$link - the full link data
        console.log('Successfully matched route', match);
      }, nomatch => {
        // nomatch.$link - the full link data
        console.error('Got a deeplink that didn\'t match', nomatch);
      });

      if (this.platform.is('cordova')) {
        this.theme$ = this.settings.get$('theme').pipe(
          tap(theme => {
            // TODO handle media query change
            const autoDark = theme === '' && window.matchMedia('(prefers-color-scheme: dark)').matches;
            // change status bar color
            if (autoDark || theme.includes('dark')) {
              this.statusBar.backgroundColorByHexString('#1d1b1b');
              this.statusBar.styleLightContent();
            } else {
              this.statusBar.backgroundColorByHexString('#e7e7e7');
              this.statusBar.styleDefault();
            }
          }),
        );
        if (this.network.type === 'none') {
          this.presentToast('You are now offline, only data stored in the cache will be accessable.', 6000);
        }
      } else {
        this.theme$ = this.settings.get$('theme');
      }
      const shakeSensitivity = this.settings.get('shakeSensitivity');
      this.shakespear.initShakespear(shakeSensitivity); // FIXME use observable to get latest value
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

  async presentToast(msg: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration,
      color: 'medium',
      position: 'top',
      buttons: [
        {
          text: 'Close',
          role: 'cancel'
        }
      ],
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

}
