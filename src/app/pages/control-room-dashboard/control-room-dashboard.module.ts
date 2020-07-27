import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChartModule } from 'angular2-chartjs';

import { SharedPipesModule } from 'src/app/shared/shared-pipes.module';
import { ControlRoomDashboardPageRoutingModule } from './control-room-dashboard-routing.module';
import { ControlRoomDashboardPage } from './control-room-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    FormsModule,
    IonicModule,
    ControlRoomDashboardPageRoutingModule,
    SharedPipesModule
  ],
  declarations: [ControlRoomDashboardPage]
})
export class ControlRoomDashboardPageModule {}
