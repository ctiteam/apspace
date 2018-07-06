import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { LecturerTimetableComponent } from './lecturer-timetable/lecturer-timetable';

@NgModule({
  declarations: [LecturerTimetableComponent],
  imports: [IonicModule],
  exports: [LecturerTimetableComponent]
})
export class ComponentsModule { }
