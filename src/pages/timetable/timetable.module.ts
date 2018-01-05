import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TimetablePage } from './timetable';
import { ToStaffPipe } from './to-staff.pipe';

@NgModule({
  declarations: [TimetablePage, ToStaffPipe],
  imports: [
    IonicPageModule.forChild(TimetablePage),
  ],
  entryComponents: [TimetablePage]
})
export class TimetablePageModule {}
