import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { DirectivesModule } from '../../directives/directives.module';
import { BusTripInfoModalPage } from './bus-trip-info-modal';

@NgModule({
  declarations: [
    BusTripInfoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(BusTripInfoModalPage),
    DirectivesModule,
  ],
})
export class BusTripInfoModalPageModule {}
