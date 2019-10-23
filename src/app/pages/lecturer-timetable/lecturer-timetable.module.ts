import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LecturerTimetableComponentModule } from '../../components/lecturer-timetable/lecturer-timetable.module';
import { LecturerTimetablePage } from './lecturer-timetable.page';

const routes: Routes = [
  {
    path: '',
    component: LecturerTimetablePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    LecturerTimetableComponentModule
  ],
  declarations: [LecturerTimetablePage]
})
export class LecturerTimetablePageModule {}
