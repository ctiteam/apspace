import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ViewProgressReportPage } from './view-progress-report.page';

const routes: Routes = [
  {
    path: '',
    component: ViewProgressReportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewProgressReportPage]
})
export class ViewProgressReportPageModule {}
