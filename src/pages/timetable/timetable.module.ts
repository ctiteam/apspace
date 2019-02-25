import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ActionSheet } from '@ionic-native/action-sheet';

import { IntakeListingProvider, TimetableProvider } from '../../providers';
import { ClassesPipe } from './classes.pipe';
import { TheDayPipe } from './theday.pipe';
import { TimetablePage } from './timetable';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [TimetablePage, ClassesPipe, TheDayPipe],
  imports: [
    IonicPageModule.forChild(TimetablePage),
    ComponentsModule,
  ],
  entryComponents: [TimetablePage],
  providers: [ActionSheet, IntakeListingProvider, TimetableProvider],
})
export class TimetablePageModule { }
