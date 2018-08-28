import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Loading, LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingControllerProvider {

  loading: Loading;

  constructor(public http: HttpClient, public loadingCtrl: LoadingController) { }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();
  }

  dismissLoading() {
    this.loading.dismiss();
  }

}
