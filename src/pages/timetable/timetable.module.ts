import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ActionSheet } from '@ionic-native/action-sheet';

import { IntakeListingProvider, TimetableProvider } from '../../providers';
import { ClassesPipe } from './classes.pipe';
import { TheDayPipe } from './theday.pipe';
import { TimetablePage } from './timetable';

@NgModule({
  declarations: [TimetablePage, ClassesPipe, TheDayPipe],
  imports: [
    IonicPageModule.forChild(TimetablePage),
  ],
  entryComponents: [TimetablePage],
  providers: [ActionSheet, IntakeListingProvider, TimetableProvider],
})
export class TimetablePageModule { }
