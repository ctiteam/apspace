import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ChartModule } from 'angular2-chartjs';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { SharedPipesModule } from '../../shared/shared-pipes.module';
import { HrPage } from './hr.page';
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
    RouterModule.forChild(routes),
    SharedPipesModule
  ],
  declarations: [HrPage, SortByDatePipe]
})
export class HrPageModule { }
