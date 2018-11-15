import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParallaxHeader } from '../../directives/parallax-header/parallax-header';
import { NewsModalPage } from './news-modal';

@NgModule({
  declarations: [
    NewsModalPage,
    ParallaxHeader,
  ],
  imports: [
    IonicPageModule.forChild(NewsModalPage),
  ],
})
export class NewsModalPageModule { }
