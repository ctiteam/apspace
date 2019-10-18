import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { ChartModule } from 'angular2-chartjs';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { StaffDashboardPage } from './staff-dashboard.page';
import { DisabledPipe } from './disabled.pipe';
import { NewsModalPage } from '../news/news-modal';

const routes: Routes = [
  {
    path: '',
    component: StaffDashboardPage
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
    StaffDashboardPage,
    DisabledPipe,
  ],
  providers: [DragulaService],
  entryComponents: []
})
export class StaffDashboardPageModule { }
