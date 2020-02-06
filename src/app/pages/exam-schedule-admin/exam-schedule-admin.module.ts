import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExamScheduleAdminPageRoutingModule } from './exam-schedule-admin-routing.module';

import { ExamScheduleAdminPage } from './exam-schedule-admin.page';
import { StrToColorPipe } from './str-to-color.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExamScheduleAdminPageRoutingModule
  ],
  declarations: [ExamScheduleAdminPage, StrToColorPipe]
})
export class ExamScheduleAdminPageModule {}
