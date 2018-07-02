import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ActionSheet} from "@ionic-native/action-sheet";

import { AttendancePage } from './attendance';

@NgModule({
  declarations: [AttendancePage],
  imports: [
    IonicPageModule.forChild(AttendancePage),
    NgCircleProgressModule.forRoot()
  ],
  entryComponents: [AttendancePage],
  providers: [ActionSheet]
})
export class AttendancePageModule { }
