import { NgModule } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPageModule } from 'ionic-angular';

import { FormsApplicationPage } from './forms-application';

@NgModule({
  declarations: [FormsApplicationPage],
  imports: [
    IonicPageModule.forChild(FormsApplicationPage),
  ],
  entryComponents: [FormsApplicationPage],
  providers: [InAppBrowser],
})
export class FormsApplicationPageModule { }
