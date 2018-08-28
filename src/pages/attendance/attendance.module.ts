import { NgModule } from '@angular/core';
import { ActionSheet } from '@ionic-native/action-sheet';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { IonicPageModule } from 'ionic-angular';

import { AttendancePage } from './attendance';

@NgModule({
  declarations: [AttendancePage],
  imports: [
    IonicPageModule.forChild(AttendancePage),
    RoundProgressModule,
  ],
  entryComponents: [AttendancePage],
  providers: [ActionSheet],
})
export class AttendancePageModule { }
