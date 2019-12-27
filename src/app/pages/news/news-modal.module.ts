import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NewsModalPage } from './news-modal';
import { SafePipe } from './safe.pipe';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [NewsModalPage, SafePipe],
  exports: [],
  entryComponents: [NewsModalPage]
})

export class NewsModalPageModule {}
