import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { NewsProvider } from '../../providers';

import { ComponentsModule } from '../../components/components.module';
import { NewsPage } from './news';

@NgModule({
  declarations: [NewsPage],
  imports: [
    IonicPageModule.forChild(NewsPage),
    ComponentsModule,
  ],
  entryComponents: [NewsPage],
  providers: [NewsProvider],
})
export class NewsPageModule { }
