import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IntakeListingService } from 'src/app/services';
import { ComponentsModule } from '../../components/components.module';
import { ExamSchedulePage } from './exam-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: ExamSchedulePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  providers: [IntakeListingService],
  declarations: [
    ExamSchedulePage
  ],
})
export class ExamSchedulePageModule {}
