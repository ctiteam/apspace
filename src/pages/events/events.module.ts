import { NgModule } from '@angular/core';
import { ChartModule } from 'angular2-chartjs';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from './../../components/components.module';
import { EventsPage } from './events';
import { ExamPipe } from './exam.pipe';

@NgModule({
  declarations: [
    EventsPage,
    ExamPipe,
  ],
  imports: [
    IonicPageModule.forChild(EventsPage),
    ComponentsModule,
    ChartModule,
  ],
})
export class EventsPageModule {}
