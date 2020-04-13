import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ChartModule } from 'angular2-chartjs';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { HrPage } from './hr.page';
import { GenerateMonthImgPipe } from './print-payslip-modal/generate-month-img.pipe';
import { GetDatePipe } from './print-payslip-modal/get-date.pipe';
import { PrintPayslipModalPage } from './print-payslip-modal/print-payslip-modal.page';
import { SortByDatePipe } from './sort-by-date.pipe';

const routes: Routes = [
  {
    path: '',
    component: HrPage
  }
];

@NgModule({
  imports: [
    ChartModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HrPage, SortByDatePipe, PrintPayslipModalPage, GetDatePipe, GenerateMonthImgPipe],
  entryComponents: [PrintPayslipModalPage]
})
export class HrPageModule { }
