import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IntakeListingService } from 'src/app/services';
import { ComponentsModule } from '../../components/components.module';
import { ExamSchedulePage } from './exam-schedule.page';
import { ModuleFilterPipe } from './module-filter.pipe';

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
    ExamSchedulePage,
    ModuleFilterPipe,
  ],
  entryComponents: []
})
export class ExamSchedulePageModule {}
