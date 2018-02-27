import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeModalPage } from './home-modal';

@NgModule({
  declarations: [
    HomeModalPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeModalPage),
  ],
})
export class HomeModalPageModule {}
