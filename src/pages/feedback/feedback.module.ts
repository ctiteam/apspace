import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedbackPage } from './feedback';

import { DirectivesModule } from '../../directives/directives.module';
import { VersionProvider } from '../../providers';

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
  ],
})
export class FeedbackPageModule { }
