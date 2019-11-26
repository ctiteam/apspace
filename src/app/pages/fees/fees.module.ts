import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChartModule } from 'angular2-chartjs';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedPipesModule } from '../../shared/shared-pipes.module';
import { FeesPage } from './fees.page';
import { FilterPipe } from './filter.pipe';

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
    SharedPipesModule
  ],
  declarations: [FeesPage, FilterPipe]
})
export class FeesPageModule {}
