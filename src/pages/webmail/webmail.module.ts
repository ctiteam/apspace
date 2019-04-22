import { NgModule } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPageModule } from 'ionic-angular';

import { WebmailPage } from './webmail';

@NgModule({
  declarations: [WebmailPage],
  imports: [
    IonicPageModule.forChild(WebmailPage),
  ],
  entryComponents: [WebmailPage],
  providers: [InAppBrowser],
})
export class LmsPageModule { }
