import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { StudentDashboardPage } from './student-dashboard.page';

import { ChartModule } from 'angular2-chartjs';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { DisabledPipe } from './disabled.pipe';
import { SectionNamePipe } from './section-name.pipe';
const routes: Routes = [
  {
    path: '',
    component: StudentDashboardPage
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
    StudentDashboardPage,
    DisabledPipe,
    SectionNamePipe
  ],
  providers: [DragulaService],
  entryComponents: []
})
export class StudentDashboardPageModule { }
