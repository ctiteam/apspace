import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { LecturerTimetableComponent } from './lecturer-timetable.component';
import { FromWeekPipe } from './from-week.pipe';
import { LengthPipe } from './length.pipe';

@NgModule({
  declarations: [LecturerTimetableComponent, FromWeekPipe, LengthPipe],
  imports: [CommonModule, IonicModule, RouterModule.forChild([])],
  exports: [LecturerTimetableComponent]
})
export class LecturerTimetableComponentModule { }
