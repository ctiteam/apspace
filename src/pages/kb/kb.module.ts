import { NgModule } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPageModule } from 'ionic-angular';

import { KbPage } from './kb';

@NgModule({
  declarations: [KbPage],
  imports: [
    IonicPageModule.forChild(KbPage),
  ],
  entryComponents: [KbPage],
  providers: [InAppBrowser],
})
export class LmsPageModule { }
