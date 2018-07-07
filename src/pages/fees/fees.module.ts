import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { FeesPage } from './fees';
import { ReversePipe } from './reverse.pipe';

@NgModule({
  declarations: [FeesPage, ReversePipe],
  imports: [
    IonicPageModule.forChild(FeesPage)
  ],
  entryComponents: [FeesPage]
})
export class FeesPageModule { }
