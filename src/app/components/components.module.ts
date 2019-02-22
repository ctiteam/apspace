import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { LecturerTimetableComponent } from './lecturer-timetable/lecturer-timetable.component';
import { SkeletonItemComponent } from './skeleton-item/skeleton-item.component';
import { SearchModalComponent } from './search-modal/search-modal.component';

@NgModule({
  declarations: [
    LecturerTimetableComponent,
    SkeletonItemComponent,
    SearchModalComponent
  ],
  imports: [IonicModule],
  exports: [
    LecturerTimetableComponent,
    SkeletonItemComponent,
    SearchModalComponent
  ],
})
export class ComponentsModule { }
