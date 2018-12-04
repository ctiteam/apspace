import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedbackPage } from './feedback';

import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    FeedbackPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedbackPage),
    DirectivesModule,
  ],

})
export class FeedbackPageModule { }
