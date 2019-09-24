import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { LecturerTimetableComponent } from './lecturer-timetable.component';
import { FromWeekPipe } from './from-week.pipe';
import { LengthPipe } from './length.pipe';
import { ReversePipe } from './reverse.pipe';

@NgModule({
  declarations: [LecturerTimetableComponent, FromWeekPipe, LengthPipe, ReversePipe],
  imports: [CommonModule, IonicModule, RouterModule.forChild([])],
  exports: [LecturerTimetableComponent]
})
export class LecturerTimetableComponentModule { }
