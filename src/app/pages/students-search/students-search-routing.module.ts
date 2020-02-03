import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentsSearchPage } from './students-search.page';

const routes: Routes = [
  {
    path: '',
    component: StudentsSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentsSearchPageRoutingModule {}
