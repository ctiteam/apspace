import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';

import { QrCodePage } from './qr-code.page';

const routes: Routes = [
  {
    path: '',
    component: QrCodePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [QrCodePage],
  providers: [QRScanner]
})
export class QrCodePageModule { }
