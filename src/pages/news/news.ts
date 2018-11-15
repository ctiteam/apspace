import { Component } from '@angular/core';
import { App, IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';

import { News } from '../../interfaces';
import { NewsProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {

  item$: Observable<News[]>;

  numOfSkeletons = new Array(3);

  constructor(
    private app: App,
    private news: NewsProvider,
  ) { }

  doRefresh(refresher?) {
    this.item$ = this.news.get(Boolean(refresher)).pipe(
      finalize(() => refresher && refresher.complete()),
    );
  }

  ionViewDidLoad() {
    this.doRefresh();
  }

  openModal(item) {
    this.app.getRootNav().push('NewsModalPage', { item });
  }
}
