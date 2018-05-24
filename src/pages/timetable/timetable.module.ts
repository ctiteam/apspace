import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ActionSheet } from '@ionic-native/action-sheet';

import { TimetablePage } from './timetable';
import { ClassesPipe } from './classes.pipe';
import { TheDayPipe } from './theday.pipe';

@NgModule({
  declarations: [TimetablePage, ClassesPipe, TheDayPipe],
  imports: [
    IonicPageModule.forChild(TimetablePage),
  ],
  entryComponents: [TimetablePage],
  providers: [ActionSheet]
})
export class TimetablePageModule { }
