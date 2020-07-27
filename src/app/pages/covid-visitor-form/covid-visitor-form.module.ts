import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { IonicModule } from '@ionic/angular';

import { SharedPipesModule } from 'src/app/shared/shared-pipes.module';
import { CovidVisitorFormPageRoutingModule } from './covid-visitor-form-routing.module';
import { CovidVisitorFormPage } from './covid-visitor-form.page';
import { VisitHistoryModalPage } from './visit-history/visit-history-modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CovidVisitorFormPageRoutingModule,
    SharedPipesModule
  ],
  declarations: [CovidVisitorFormPage, VisitHistoryModalPage],
  entryComponents: [VisitHistoryModalPage],
  providers: [QRScanner]
})
export class CovidVisitorFormPageModule {}
