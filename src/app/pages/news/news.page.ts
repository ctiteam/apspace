import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { News } from '../../interfaces';
import { NewsService } from '../../services';
import { ModalController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { NewsModalPage } from './news-modal';
@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  item$: Observable<News[]>;

  skeletonSettings = {
    numberOfSkeltons: new Array(9),
  };
  constructor(

    private news: NewsService,
    private modalCtrl: ModalController,
    public  navCtrl: NavController,
  ) { }

  doRefresh(refresher?) {
    this.item$ = this.news.get(Boolean(refresher)).pipe(
      finalize(() => refresher && refresher.target.complete()),
    );
  }
  ngOnInit() {
    this.doRefresh();
  }
  async openModal(item: News) {
    console.log(item);

    const modal = await this.modalCtrl.create({
      component: NewsModalPage,
      // TODO: store search history
      componentProps: { item, notFound: 'No news Selected' },
    });
    await modal.present();
    // default item to current intake if model dismissed without data
    await modal.onDidDismiss();
  }
}
