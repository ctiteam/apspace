import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { News } from '../../interfaces';
@Component({
  selector: 'page-news-modal',
  templateUrl: 'news-modal.html',
})
export class NewsModalPage {

  item: News;

  constructor(
    public params: NavParams,
    private modalCtrl: ModalController) {
    this.item = this.params.get('item');
  }

  ionViewWillEnter() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
