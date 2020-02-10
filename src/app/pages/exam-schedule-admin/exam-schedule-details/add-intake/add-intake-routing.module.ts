import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddIntakePage } from './add-intake.page';

const routes: Routes = [
  {
    path: '',
    component: AddIntakePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddIntakePageRoutingModule {}
