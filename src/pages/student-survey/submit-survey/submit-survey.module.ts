import { NgModule } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
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
  providers: [InAppBrowser],
})
export class SubmitSurveyPageModule { }
