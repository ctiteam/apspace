import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusTrackingPage } from './bus-tracking';
import { TripDatePipe } from './trip-date.pipe';
import { TripNextPipe } from './trip-next.pipe';
import { TripTimePipe } from './trip-time.pipe';

@NgModule({
  declarations: [
    BusTrackingPage,
    TripDatePipe,
    TripNextPipe,
    TripTimePipe,
  ],
  imports: [
    IonicPageModule.forChild(BusTrackingPage),
  ],
})
export class BusTrackingPageModule { }
