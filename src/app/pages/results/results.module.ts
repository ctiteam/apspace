import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'angular2-chartjs';
import { SemPipe } from './sem.pipe';

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
