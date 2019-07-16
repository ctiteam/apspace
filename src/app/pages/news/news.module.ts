import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NewsService } from '../../services';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../components/components.module';
import { NewsPage } from './news.page';
import { NewsModalPage } from './news-modal';

const routes: Routes = [
  {
    path: '',
    component: NewsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewsPage, NewsModalPage],
  entryComponents: [NewsModalPage],
})

export class NewsPageModule {}
