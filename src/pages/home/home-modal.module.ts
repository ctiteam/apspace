import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeModalPage } from './home-modal';
import { ParallaxHeader } from '../../directives/parallax-header/parallax-header';


@NgModule({
  declarations: [
    HomeModalPage,
    ParallaxHeader
  ],
  imports: [
    IonicPageModule.forChild(HomeModalPage),
  ],
})
export class HomeModalPageModule { }
