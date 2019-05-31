import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { LecturerTimetableComponent } from './lecturer-timetable/lecturer-timetable';
import { SkeletonItemComponent } from './skeleton-item/skeleton-item';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner';
import { FireworksComponent } from './fireworks/fireworks';

@NgModule({
  declarations: [
    LecturerTimetableComponent,
    SkeletonItemComponent,
    LoadingSpinnerComponent,
    FireworksComponent
  ],
  imports: [IonicModule],
  exports: [
    LecturerTimetableComponent,
    SkeletonItemComponent,
    LoadingSpinnerComponent,
    FireworksComponent
  ],
})
export class ComponentsModule { }
