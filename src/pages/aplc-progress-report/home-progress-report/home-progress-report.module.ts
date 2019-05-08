import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from './../../../components/components.module';
import { HomeProgressReportPage } from './home-progress-report';

@NgModule({
  declarations: [HomeProgressReportPage],
  imports: [
    IonicPageModule.forChild(HomeProgressReportPage),
    ComponentsModule,
  ],
  entryComponents: [HomeProgressReportPage],
})
export class HomeProgressReportPageModule { }
