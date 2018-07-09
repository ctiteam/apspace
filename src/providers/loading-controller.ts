import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingControllerProvider {

  loading: any;

  constructor(
    public http: HttpClient,
    public loadingCtrl: LoadingController) { }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  dismissLoading() {
    this.loading.dismiss();
  }
}
