import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { UpdateAttendancePage } from './update-attendance.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateAttendancePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [BarcodeScanner],
  declarations: [UpdateAttendancePage]
})
export class UpdateAttendancePageModule {}
