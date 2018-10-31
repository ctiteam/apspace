import { NgModule } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPageModule } from 'ionic-angular';

import { KohaPage } from './koha';

@NgModule({
  declarations: [KohaPage],
  imports: [
    IonicPageModule.forChild(KohaPage),
  ],
  entryComponents: [KohaPage],
  providers: [InAppBrowser],
})
export class KohaPageModule { }
