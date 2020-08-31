import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { IonicModule } from '@ionic/angular';

import { ApcardQrCodePage } from './apcard-qr-code.page';
import { VisitHistoryModalPage } from './visit-history/visit-history-modal';

const routes: Routes = [
  {
    path: '',
    component: ApcardQrCodePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ApcardQrCodePage, VisitHistoryModalPage],
  entryComponents: [VisitHistoryModalPage],
  providers: [QRScanner]
})
export class ApcardQrCodePageModule { }
