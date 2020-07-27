import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SharedPipesModule } from 'src/app/shared/shared-pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { EndtimePipe } from './endtime.pipe';
import { LecturerTimetablePage } from './lecturer-timetable.page';
import { ThedayPipe } from './theday.pipe';
import { TheweekPipe } from './theweek.pipe';

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
    ComponentsModule,
    SharedPipesModule
  ],
  declarations: [
    LecturerTimetablePage,
    ThedayPipe,
    TheweekPipe,
    EndtimePipe,
  ]
})
export class LecturerTimetablePageModule {}
