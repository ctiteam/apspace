import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

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
