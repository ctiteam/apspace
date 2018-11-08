import { Component } from '@angular/core';
import { App, IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';

import { News } from '../../interfaces';
import { NewsProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  items$: Observable<News[]>;

  numOfSkeletons = new Array(5);
  isLoading: boolean;

  constructor(
    private app: App,
    private news: NewsProvider,
  ) { }

  doRefresh(refresher?) {
    this.isLoading = true;
    this.items$ = this.news.get(Boolean(refresher)).pipe(
      finalize(() => { refresher && refresher.complete(), this.isLoading = false; }),
    );
  }

  ionViewDidLoad() {
    this.doRefresh();
  }

  openModal(item) {
    this.app.getRootNav().push('HomeModalPage', { item });
  }
}
