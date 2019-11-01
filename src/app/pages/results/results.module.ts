import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChartModule } from 'angular2-chartjs';
import { SemPipe } from './sem.pipe';

import { ComponentsModule } from 'src/app/components/components.module';
import { ResultsPage } from './results.page';

const routes: Routes = [
  {
    path: '',
    component: ResultsPage
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
  declarations: [
    ResultsPage,
    SemPipe
  ]
})
export class ResultsPageModule {}
