import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ModalController, NavParams } from '@ionic/angular';
import { News } from '../../interfaces';
@Component({
  selector: 'page-news-modal',
  templateUrl: 'news-modal.html',
})
export class NewsModalPage {

  item: News;

  constructor(
    private sanitizer: DomSanitizer,
    public params: NavParams,
    private modalCtrl: ModalController) {
    this.item = this.params.get('item');
  }

  sanitize(value: string): SafeHtml {
    // const href = value.match(/href="([^"]*)/)[1];
    return this.sanitizer.sanitize(SecurityContext.HTML, value);
  }

  ionViewWillEnter() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
