import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CalendarModule } from 'ion2-calendar';

import { ComponentsModule } from 'src/app/components/components.module';
import { AddExamSchedulePageRoutingModule } from './add-exam-schedule-routing.module';
import { AddExamSchedulePage } from './add-exam-schedule.page';
import { ManageAssessmentTypesPageModule } from './manage-assessment-types/manage-assessment-types.module';
import { ModulesFilterPipe } from './modules-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddExamSchedulePageRoutingModule,
    CalendarModule,
    ReactiveFormsModule,
    ComponentsModule,
    ManageAssessmentTypesPageModule
  ],
  declarations: [AddExamSchedulePage, ModulesFilterPipe]
})
export class AddExamSchedulePageModule {}
