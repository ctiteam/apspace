import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UpdateProgressReportPage } from './update-progress-report.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateProgressReportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UpdateProgressReportPage]
})
export class UpdateProgressReportPageModule {}
