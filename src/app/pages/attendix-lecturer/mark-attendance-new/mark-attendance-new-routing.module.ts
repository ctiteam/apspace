import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MarkAttendanceNewPage } from './mark-attendance-new.page';

const routes: Routes = [
  {
    path: '',
    component: MarkAttendanceNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarkAttendanceNewPageRoutingModule {}
