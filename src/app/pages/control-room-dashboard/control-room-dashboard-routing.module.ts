import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ControlRoomDashboardPage } from './control-room-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: ControlRoomDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlRoomDashboardPageRoutingModule {}
