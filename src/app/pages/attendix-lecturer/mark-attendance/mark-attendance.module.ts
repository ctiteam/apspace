import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChartModule } from 'angular2-chartjs';
import { QRCodeModule } from 'angularx-qrcode';

import { AttendixNewGuard } from '../attendix-new.guard';
import { AttendancePipe } from './attendance.pipe';
import { CharsPipe } from './chars.pipe';
import { MarkAttendanceNewPage } from './mark-attendance-new.page';
import { MarkAttendancePage } from './mark-attendance.page';
import { SearchPipe } from './search.pipe';

const routes: Routes = [
  {
    path: '',
    component: MarkAttendancePage,
    canActivate: [AttendixNewGuard]
  },
  {
    path: 'new',
    component: MarkAttendanceNewPage,
    canActivate: [AttendixNewGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    QRCodeModule
  ],
  declarations: [MarkAttendancePage, MarkAttendanceNewPage, CharsPipe, SearchPipe, AttendancePipe]
})
export class MarkAttendancePageModule { }
