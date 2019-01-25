import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { FireworksComponent } from './fireworks/fireworks';
import { LecturerTimetableComponent } from './lecturer-timetable/lecturer-timetable';
import { SkeletonItemComponent } from './skeleton-item/skeleton-item';

@NgModule({
  declarations: [
    FireworksComponent,
    LecturerTimetableComponent,
    SkeletonItemComponent,
  ],
  imports: [IonicModule],
  exports: [
    FireworksComponent,
    LecturerTimetableComponent,
    SkeletonItemComponent,
  ],
})
export class ComponentsModule { }
