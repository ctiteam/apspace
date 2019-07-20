import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';

import { TakeAttendancePage } from './take-attendance.page';
import { CharsPipe } from './chars.pipe';

const routes: Routes = [
  {
    path: '',
    component: TakeAttendancePage
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
  declarations: [TakeAttendancePage, CharsPipe]
})
export class TakeAttendancePageModule { }
