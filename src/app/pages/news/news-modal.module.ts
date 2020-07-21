import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { SharedPipesModule } from 'src/app/shared/shared-pipes.module';
import { NewsModalPage } from './news-modal';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedPipesModule
  ],
  declarations: [NewsModalPage],
  exports: [],
})

export class NewsModalPageModule {}
