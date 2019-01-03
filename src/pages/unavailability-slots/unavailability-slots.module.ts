import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicErrorHandler, IonicPageModule } from 'ionic-angular';
import { SlotsProvider } from '../../providers/slots';
import { UnavailabilitySlotsPage } from './unavailability-slots';

@NgModule({
  declarations: [
    UnavailabilitySlotsPage,
  ],
  imports: [
    IonicPageModule.forChild(UnavailabilitySlotsPage),
    HttpModule,
  ],
  providers: [
    StatusBar,
    { provide: ErrorHandler, useClass: IonicErrorHandler }, SlotsProvider,
  ],
})
export class UnavailabilitySlotsPageModule { }
