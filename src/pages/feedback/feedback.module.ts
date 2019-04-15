import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedbackPage } from './feedback';

import { DirectivesModule } from '../../directives/directives.module';
import { VersionProvider } from '../../providers';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    FeedbackPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedbackPage),
    DirectivesModule,
  ],
  providers: [
    VersionProvider,
    InAppBrowser
  ],
})
export class FeedbackPageModule { }
