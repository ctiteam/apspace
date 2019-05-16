import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from './../../../components/components.module';
import { SubmitSurveyPage } from './submit-survey';

@NgModule({
  declarations: [SubmitSurveyPage],
  imports: [
    IonicPageModule.forChild(SubmitSurveyPage),
    ComponentsModule,
  ],
  entryComponents: [SubmitSurveyPage],
})
export class SubmitSurveyPageModule { }
