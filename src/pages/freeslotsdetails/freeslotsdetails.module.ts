import { ErrorHandler, NgModule } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicErrorHandler, IonicPageModule } from 'ionic-angular';
import { SlotsProvider } from '../../providers';
import { FreeslotsdetailsPage } from './freeslotsdetails';

@NgModule({
  declarations: [
    FreeslotsdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(FreeslotsdetailsPage),
  ],
  providers: [
    StatusBar,
    { provide: ErrorHandler, useClass: IonicErrorHandler }, SlotsProvider,
  ],
})
export class FreeslotsdetailsPageModule { }
