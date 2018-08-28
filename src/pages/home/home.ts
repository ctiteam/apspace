import { Component } from '@angular/core';
import {
  App,
  Events,
  IonicPage,
  NavController,
  Platform,
} from 'ionic-angular';

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

  constructor(
    public events: Events,
    public plt: Platform,
    private news: NewsProvider,
    private app: App,
    private navCtrl: NavController,
  ) { }

  doRefresh(refresher?) {
    this.items$ = this.news.get(Boolean(refresher)).pipe(
      finalize(() => refresher && refresher.complete()),
    );
  }

  ionViewDidLoad() {
    this.doRefresh();
  }

  openModal(item) {
    this.app.getRootNav().push('HomeModalPage', { item });
  }

  swipe(event) {
    if (event.direction === 2) {
      this.navCtrl.parent.select(1);
    }
  }
}
