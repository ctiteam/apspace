import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VisaStatusPage } from './visa-status.page';
import { ChartModule } from 'angular2-chartjs';

const routes: Routes = [
  {
    path: '',
    component: VisaStatusPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VisaStatusPage]
})
export class VisaStatusPageModule {}
