import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { ComponentsModule } from 'src/app/components/components.module';
import { AttendancePage } from './attendance.page';
import { ReversePipe } from './reverse.pipe';

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
  declarations: [AttendancePage, ReversePipe]
})
export class AttendancePageModule { }
