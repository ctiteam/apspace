import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChartModule } from 'angular2-chartjs';
import { DragulaModule, DragulaService } from 'ng2-dragula';

import { ComponentsModule } from 'src/app/components/components.module';
import { DashboardPage } from './dashboard.page';
import { DisabledPipe } from './disabled.pipe';
import { SectionNamePipe } from './section-name.pipe';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage
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
  declarations: [DashboardPage, DisabledPipe, SectionNamePipe],
  providers: [DragulaService]
})
export class DashboardPageModule {}
