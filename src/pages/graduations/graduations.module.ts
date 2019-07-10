import { NgModule } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPageModule } from 'ionic-angular';

import { GraduationsPage } from './graduations';

@NgModule({
  declarations: [GraduationsPage],
  imports: [
    IonicPageModule.forChild(GraduationsPage),
  ],
  entryComponents: [GraduationsPage],
  providers: [InAppBrowser],
})
export class LmsPageModule { }
