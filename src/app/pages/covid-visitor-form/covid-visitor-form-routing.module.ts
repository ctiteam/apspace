import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CovidVisitorFormPage } from './covid-visitor-form.page';

const routes: Routes = [
  {
    path: '',
    component: CovidVisitorFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CovidVisitorFormPageRoutingModule {}
