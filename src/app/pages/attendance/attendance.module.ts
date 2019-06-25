import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { AttendancePage } from './attendance.page';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: AttendancePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    RoundProgressModule,
    ComponentsModule,
  ],
  declarations: [AttendancePage]
})
export class AttendancePageModule {}
