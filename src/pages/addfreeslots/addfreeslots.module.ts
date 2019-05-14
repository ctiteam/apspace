import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicErrorHandler, IonicPageModule } from 'ionic-angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { SlotsProvider } from '../../providers/slots';
import { AddfreeslotsPage } from './addfreeslots';

import { CalendarModule } from "ion2-calendar";

@NgModule({
  declarations: [
    AddfreeslotsPage,
  ],
  imports: [
    IonicPageModule.forChild(AddfreeslotsPage),
    HttpModule,
    IonicSelectableModule,
    CalendarModule
  ],
  providers: [
    StatusBar,
    { provide: ErrorHandler, useClass: IonicErrorHandler }, SlotsProvider,
  ],
})
export class AddfreeslotsPageModule { }
