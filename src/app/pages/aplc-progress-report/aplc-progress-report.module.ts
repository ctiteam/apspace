import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AplcProgressReportPage } from './aplc-progress-report.page';

const routes: Routes = [
  {
    path: '',
    component: AplcProgressReportPage,
    children:
      [
        {
          path: 'view',
          loadChildren: () => import('../aplc-progress-report/view-progress-report/view-progress-report.module')
            .then(m => m.ViewProgressReportPageModule)
        },
        {
          path: 'update',
          loadChildren: () => import('../aplc-progress-report/update-progress-report/update-progress-report.module')
            .then(m => m.UpdateProgressReportPageModule)
        },
        {
          path: 'admin',
          loadChildren: () => import('../aplc-progress-report/view-progress-report/view-progress-report.module')
            .then(m => m.ViewProgressReportPageModule)
        },
        {
          path: '',
          redirectTo: 'view',
          pathMatch: 'full'
        }
      ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AplcProgressReportPage]
})
export class AplcProgressReportPageModule { }
