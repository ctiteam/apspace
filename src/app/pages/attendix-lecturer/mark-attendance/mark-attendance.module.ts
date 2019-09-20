import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';

import { MarkAttendancePage } from './mark-attendance.page';
import { CharsPipe } from './chars.pipe';
import { SearchPipe } from './search.pipe';
import { AttendancePipe } from './attendance.pipe';

const routes: Routes = [
  {
    path: '',
    component: MarkAttendancePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    QRCodeModule
  ],
  declarations: [MarkAttendancePage, CharsPipe, SearchPipe, AttendancePipe]
})
export class MarkAttendancePageModule { }
