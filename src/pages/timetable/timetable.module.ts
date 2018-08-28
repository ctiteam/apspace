import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ActionSheet } from '@ionic-native/action-sheet';

import { TimetableProvider } from '../../providers';
import { ClassesPipe } from './classes.pipe';
import { TheDayPipe } from './theday.pipe';
import { TimetablePage } from './timetable';

@NgModule({
  declarations: [TimetablePage, ClassesPipe, TheDayPipe],
  imports: [
    IonicPageModule.forChild(TimetablePage),
  ],
  entryComponents: [TimetablePage],
  providers: [ActionSheet, TimetableProvider],
})
export class TimetablePageModule { }
