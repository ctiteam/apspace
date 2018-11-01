import { NgModule } from '@angular/core';
import { ChartModule } from 'angular2-chartjs';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from './../../components/components.module';
import { EventsPage } from './events';
import { ExamPipe } from './exam.pipe';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [
    EventsPage,
    ExamPipe,
  ],
  imports: [
    IonicPageModule.forChild(EventsPage),
    ComponentsModule,
    ChartModule,
    RoundProgressModule,
    NgCircleProgressModule.forRoot({
      radius: 80,
      maxPercent: 100,
      titleFontSize: '30',
      responsive: true,
      showSubtitle: false,
      unitsFontSize: '30',
      outerStrokeWidth: 16,
      innerStrokeWidth: 14,
      animationDuration: 600,
    })
  ],
})
export class EventsPageModule { }
