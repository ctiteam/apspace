import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ActionSheet } from '@ionic-native/action-sheet';

import { TimetablePage } from './timetable';

@NgModule({
  declarations: [TimetablePage],
  imports: [
    IonicPageModule.forChild(TimetablePage),
  ],
  entryComponents: [TimetablePage],
  providers: [ActionSheet]
})
export class TimetablePageModule { }
