import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavParams, ModalController } from '@ionic/angular';
import { News } from '../../interfaces';
@Component({
  selector: 'page-news-modal',
  templateUrl: 'news-modal.html',
})
export class NewsModalPage implements OnInit {

  item: News;

  constructor(
    private sanitizer: DomSanitizer,
    public params: NavParams,
    private modalCtrl: ModalController) {
    this.item = this.params.get('item');
  }
  sanitize(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);

  }
  ngOnInit() {
  }
  ionViewWillEnter() {
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
