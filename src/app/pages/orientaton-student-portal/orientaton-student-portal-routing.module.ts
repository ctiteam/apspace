import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrientatonStudentPortalPage } from './orientaton-student-portal.page';

const routes: Routes = [
  {
    path: '',
    component: OrientatonStudentPortalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrientatonStudentPortalPageRoutingModule {}
