import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ActionSheet } from '@ionic-native/action-sheet';

import { TimetableProvider } from '../../providers';
import { TimetablePage } from './timetable';
import { ClassesPipe } from './classes.pipe';
import { TheDayPipe } from './theday.pipe';

@NgModule({
  declarations: [TimetablePage, ClassesPipe, TheDayPipe],
  imports: [
    IonicPageModule.forChild(TimetablePage),
  ],
  entryComponents: [TimetablePage],
  providers: [ActionSheet, TimetableProvider]
})
export class TimetablePageModule { }
