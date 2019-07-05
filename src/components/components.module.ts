import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { LecturerTimetableComponent } from './lecturer-timetable/lecturer-timetable';
import { SkeletonItemComponent } from './skeleton-item/skeleton-item';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner';

@NgModule({
  declarations: [
    LecturerTimetableComponent,
    SkeletonItemComponent,
    LoadingSpinnerComponent,
  ],
  imports: [IonicModule],
  exports: [
    LecturerTimetableComponent,
    SkeletonItemComponent,
    LoadingSpinnerComponent
  ],
})
export class ComponentsModule { }
