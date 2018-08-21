import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashBoardPage } from './dash-board';

@NgModule({
  declarations: [
    DashBoardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashBoardPage),
  ],
})
export class DashBoardPageModule {}
