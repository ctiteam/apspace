import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CovidVisitorSessionPassPage } from './covid-visitor-session-pass.page';

const routes: Routes = [
  {
    path: '',
    component: CovidVisitorSessionPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CovidVisitorSessionPassPageRoutingModule {}
