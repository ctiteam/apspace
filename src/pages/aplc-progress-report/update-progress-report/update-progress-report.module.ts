import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from './../../../components/components.module';
import { UpdateProgressReportPage } from './update-progress-report';

@NgModule({
  declarations: [UpdateProgressReportPage],
  imports: [
    IonicPageModule.forChild(UpdateProgressReportPage),
    ComponentsModule,
  ],
  entryComponents: [UpdateProgressReportPage],
})
export class UpdateProgressReportPageModule { }
