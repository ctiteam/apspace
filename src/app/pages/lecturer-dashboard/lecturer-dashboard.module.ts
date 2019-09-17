import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ChartModule } from 'angular2-chartjs';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { LecturerDashboardPage } from './lecturer-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: LecturerDashboardPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    ChartModule,
    DragulaModule
  ],
  declarations: [
    LecturerDashboardPage
  ],
  providers: [DragulaService],
  entryComponents: []
})
export class LecturerDashboardPageModule { }
