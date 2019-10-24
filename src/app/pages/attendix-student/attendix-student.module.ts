import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { IonicModule } from '@ionic/angular';

import { GraphQLModule } from '../../graphql.module';
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
    GraphQLModule,
    RouterModule.forChild(routes)
  ],
  providers: [BarcodeScanner, QRScanner],
  declarations: [AttendixStudentPage]
})
export class AttendixStudentPageModule {}
