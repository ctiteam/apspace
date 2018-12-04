import { NgModule } from '@angular/core';
import { ActionSheet } from '@ionic-native/action-sheet';
import { IonicPageModule } from 'ionic-angular';

import { TimetableProvider } from '../../providers/timetable';
import { ClassroomFinderModalPage } from './classroom-finder-modal';
import { RoomPipe } from './room.pipe';
import { FilterDayPipe } from './theday.pipe';

@NgModule({
  declarations: [ClassroomFinderModalPage, FilterDayPipe, RoomPipe],
  imports: [
    IonicPageModule.forChild(ClassroomFinderModalPage),
  ],
  providers: [
    ActionSheet,
    TimetableProvider,
  ],
})
export class ClassroomFinderModalPageModule {}
