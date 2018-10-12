import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParallaxHeader } from '../../directives/parallax-header/parallax-header';
import { HomeModalPage } from './home-modal';

@NgModule({
  declarations: [
    HomeModalPage,
    ParallaxHeader,
  ],
  imports: [
    IonicPageModule.forChild(HomeModalPage),
  ],
})
export class HomeModalPageModule { }
