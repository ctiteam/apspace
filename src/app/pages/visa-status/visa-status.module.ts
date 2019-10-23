import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChartModule } from 'angular2-chartjs';
import { ComponentsModule } from 'src/app/components/components.module';
import { VisaStatusPage } from './visa-status.page';

const routes: Routes = [
  {
    path: '',
    component: VisaStatusPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ChartModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VisaStatusPage]
})
export class VisaStatusPageModule {}
