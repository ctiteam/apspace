import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendancePage } from './attendance';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [AttendancePage],
  imports: [
    IonicPageModule.forChild(AttendancePage),
    NgCircleProgressModule.forRoot()

  ],
  entryComponents: [AttendancePage]
})
export class AttendancePageModule {}
