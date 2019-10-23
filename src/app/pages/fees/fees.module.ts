import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChartModule } from 'angular2-chartjs';
import { ComponentsModule } from 'src/app/components/components.module';
import { FeesPage } from './fees.page';
import { FilterPipe } from './filter.pipe';
import { ReversePipe } from './reverse.pipe';

const routes: Routes = [
  {
    path: '',
    component: FeesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ChartModule,
    ComponentsModule,
  ],
  declarations: [FeesPage, ReversePipe, FilterPipe]
})
export class FeesPageModule {}
