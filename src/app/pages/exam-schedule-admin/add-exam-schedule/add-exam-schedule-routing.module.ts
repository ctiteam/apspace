import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddExamSchedulePage } from './add-exam-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: AddExamSchedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddExamSchedulePageRoutingModule {}
