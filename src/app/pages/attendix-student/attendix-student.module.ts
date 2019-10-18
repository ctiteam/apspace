import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';

import { AttendixStudentPage } from './attendix-student.page';

const routes: Routes = [
  {
    path: '',
    component: AttendixStudentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [BarcodeScanner, QRScanner],
  declarations: [AttendixStudentPage]
})
export class AttendixStudentPageModule {}
