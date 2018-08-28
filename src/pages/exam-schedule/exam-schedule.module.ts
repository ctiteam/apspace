import { NgModule } from '@angular/core';
import { ActionSheet } from '@ionic-native/action-sheet';
import { IonicPageModule } from 'ionic-angular';
import { TimetableProvider } from '../../providers';
import { ExamSchedulePage } from './exam-schedule';

@NgModule({
  declarations: [
    ExamSchedulePage,
  ],
  imports: [
    IonicPageModule.forChild(ExamSchedulePage),
  ],
  providers: [ActionSheet, TimetableProvider],
})
export class ExamSchedulePageModule { }
