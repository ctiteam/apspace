import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExamScheduleDetailsPageRoutingModule } from './exam-schedule-details-routing.module';

import { AddExamSchedulePageModule } from '../add-exam-schedule/add-exam-schedule.module';
import { AddIntakePageModule } from './add-intake/add-intake.module';
import { ExamScheduleDetailsPage } from './exam-schedule-details.page';
import { StrToColorPipe } from './str-to-color.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExamScheduleDetailsPageRoutingModule,
    AddExamSchedulePageModule,
    AddIntakePageModule
  ],
  declarations: [ExamScheduleDetailsPage, StrToColorPipe]
})
export class ExamScheduleDetailsPageModule {}
