import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExamSchedulePage } from './exam-schedule';
import { ActionSheet } from '@ionic-native/action-sheet';
import { TimetableProvider } from '../../providers';

@NgModule({
  declarations: [
    ExamSchedulePage,
  ],
  imports: [
    IonicPageModule.forChild(ExamSchedulePage),
  ],
  providers: [ActionSheet, TimetableProvider]
})
export class ExamSchedulePageModule { }
