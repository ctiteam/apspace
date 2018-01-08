import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TimetableConfPage } from './timetable-conf';

@NgModule({
  declarations: [TimetableConfPage],
  imports: [
    IonicPageModule.forChild(TimetableConfPage),
  ],
  entryComponents: [TimetableConfPage]
})
export class TimetableConfPageModule {}
