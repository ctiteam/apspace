import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicErrorHandler, IonicPageModule } from 'ionic-angular';
import { SlotsProvider } from '../../providers/slots';
import { UnavailabilitySlotsPage } from './unavailability-slots';
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  declarations: [
    UnavailabilitySlotsPage,
  ],
  imports: [
    IonicPageModule.forChild(UnavailabilitySlotsPage),
    HttpModule,
    CalendarModule
  ],
  providers: [
    StatusBar,
    { provide: ErrorHandler, useClass: IonicErrorHandler }, SlotsProvider,
  ],
})
export class UnavailabilitySlotsPageModule { }
