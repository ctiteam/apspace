import { NgModule } from '@angular/core';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { ChartModule } from 'angular2-chartjs';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from './../../components/components.module';
import { DashboardPage } from './dashboard';
import { ExamPipe } from './exam.pipe';
import { TimetableProvider } from '../../providers';

@NgModule({
  declarations: [
    DashboardPage,
    ExamPipe,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    ComponentsModule,
    ChartModule,
    RoundProgressModule,
  ],
  providers: [TimetableProvider],
})
export class DashboardPageModule { }
