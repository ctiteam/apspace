import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { ShortNews } from '../../interfaces';
@Component({
  selector: 'page-news-modal',
  templateUrl: 'news-modal.html',
})
export class NewsModalPage {

  newsItem: ShortNews;

  constructor(
    public params: NavParams,
    private modalCtrl: ModalController) {
  }

  ionViewWillEnter() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
