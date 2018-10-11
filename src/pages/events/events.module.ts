import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsPage } from './events';
import { ChartModule } from 'angular2-chartjs';
import { ComponentsModule } from './../../components/components.module';

@NgModule({
  declarations: [
    EventsPage,
  ],
  imports: [
    IonicPageModule.forChild(EventsPage),
    ComponentsModule,
    ChartModule
  ],
})
export class EventsPageModule {}
