import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../components/components.module';
import { LecturerTimetablePage } from './lecturer-timetable';

@NgModule({
  declarations: [LecturerTimetablePage],
  imports: [
    IonicPageModule.forChild(LecturerTimetablePage),
    ComponentsModule,
  ],
  entryComponents: [LecturerTimetablePage]
})
export class LecturerTimetablePageModule {}
