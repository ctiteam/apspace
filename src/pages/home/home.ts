import { Component } from '@angular/core';
import {
  Platform, Events, MenuController, NavController,
  ToastController, IonicPage
} from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';

import { News } from '../../interfaces';
import { NewsProvider, LoadingControllerProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items$: Observable<News[]>;

  exit = false;
  back = null;

  constructor(
    public events: Events,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public plt: Platform,
    private news: NewsProvider,
    private toastCtrl: ToastController,
    private loading: LoadingControllerProvider
  ) {
    this.plt.ready().then(() => {
      if (this.plt.is('cordova')) {
        this.events.subscribe('user:logout', _ => this.back && this.back());
        this.back = this.plt.registerBackButtonAction(() => {
          if (this.menuCtrl.isOpen()) {
            this.menuCtrl.close();
          } else if (this.navCtrl.canGoBack()) {
            this.navCtrl.pop();
          } else if (this.exit) {
            this.plt.exitApp();
          } else if (this.loading.dismissLoading()){
            this.loading.dismissLoading();
          } else {
            let toast = this.toastCtrl.create({
              message: 'Tap again to exit.',
              duration: 2000,
              cssClass: 'normalToast'
            });
            this.exit = true;
            toast.onDidDismiss(() => this.exit = false);
            toast.present();
          }
        });
      }
    });
  }

  doRefresh(refresher?) {
    this.items$ = this.news.get(Boolean(refresher)).pipe(
      finalize(() => refresher && refresher.complete())
    );
  }

  ionViewDidLoad() {
    this.doRefresh();
  }
}
