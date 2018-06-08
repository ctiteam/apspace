import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeModalPage } from './home-modal';
import { ParallaxHeaderDirective } from '../../directives/parallax-header/parallax-header';

@NgModule({
  declarations: [
    HomeModalPage,
    ParallaxHeaderDirective
  ],
  imports: [
    IonicPageModule.forChild(HomeModalPage),
  ],
})
export class HomeModalPageModule { }
