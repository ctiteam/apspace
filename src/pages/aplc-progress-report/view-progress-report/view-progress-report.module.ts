import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from './../../../components/components.module';
import { ViewProgressReportPage } from './view-progress-report';

@NgModule({
  declarations: [ViewProgressReportPage],
  imports: [
    IonicPageModule.forChild(ViewProgressReportPage),
    ComponentsModule,
  ],
  entryComponents: [ViewProgressReportPage],
})
export class ApcardPageModule { }
