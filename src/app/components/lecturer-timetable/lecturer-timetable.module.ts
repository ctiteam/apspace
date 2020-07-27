import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SharedPipesModule } from 'src/app/shared/shared-pipes.module';
import { FromWeekPipe } from './from-week.pipe';
import { LecturerTimetableComponent } from './lecturer-timetable.component';
import { LengthPipe } from './length.pipe';
import { ReversePipe } from './reverse.pipe';

@NgModule({
  declarations: [LecturerTimetableComponent, FromWeekPipe, LengthPipe, ReversePipe],
  imports: [CommonModule, IonicModule, RouterModule.forChild([]), SharedPipesModule],
  exports: [LecturerTimetableComponent]
})
export class LecturerTimetableComponentModule { }
