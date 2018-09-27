import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { LecturerTimetableComponent } from './lecturer-timetable/lecturer-timetable';
import { SkeletonItemComponent } from './skeleton-item/skeleton-item';

@NgModule({
  declarations: [LecturerTimetableComponent,
    SkeletonItemComponent],
  imports: [IonicModule],
  exports: [LecturerTimetableComponent,
    SkeletonItemComponent],
})
export class ComponentsModule { }
