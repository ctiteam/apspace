import { NgModule } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPageModule } from 'ionic-angular';

import { LmsPage } from './lms';

@NgModule({
  declarations: [LmsPage],
  imports: [
    IonicPageModule.forChild(LmsPage),
  ],
  entryComponents: [LmsPage],
  providers: [InAppBrowser],
})
export class LmsPageModule { }
