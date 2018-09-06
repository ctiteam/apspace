import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicSwipeAllModule } from 'ionic-swipe-all';
import { BusTripInfoModalPage } from './bus-trip-info-modal';

@NgModule({
  declarations: [
    BusTripInfoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(BusTripInfoModalPage),
    IonicSwipeAllModule,
  ],
})
export class BusTripInfoModalPageModule {}
