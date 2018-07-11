import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { ActionSheet } from "@ionic-native/action-sheet";

import { AttendancePage } from './attendance';

@NgModule({
  declarations: [AttendancePage],
  imports: [
    IonicPageModule.forChild(AttendancePage),
    RoundProgressModule,
  ],
  entryComponents: [AttendancePage],
  providers: [ActionSheet]
})
export class AttendancePageModule { }
