import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExamScheduleDetailsPage } from './exam-schedule-details.page';

const routes: Routes = [
  {
    path: '',
    component: ExamScheduleDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamScheduleDetailsPageRoutingModule {}
