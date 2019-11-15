import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { IonicModule } from '@ionic/angular';

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
  providers: [QRScanner],
  declarations: [AttendixStudentPage]
})
export class AttendixStudentPageModule {}
