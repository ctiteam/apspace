import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [
    LecturerTimetableComponent,
    SkeletonItemComponent,
    SearchModalComponent
  ],
  entryComponents: [
    SearchModalComponent
  ]
})
export class ComponentsModule { }
