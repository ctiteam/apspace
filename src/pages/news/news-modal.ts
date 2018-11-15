import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IonicPage, NavParams } from 'ionic-angular';

import { News } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-news-modal',
  templateUrl: 'news-modal.html',
})
export class NewsModalPage {

  item: News;

  constructor(
    public params: NavParams,
    private sanitizer: DomSanitizer) { }

  sanitize(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  ionViewDidLoad() {
    this.item = this.params.get('item');
  }
}
