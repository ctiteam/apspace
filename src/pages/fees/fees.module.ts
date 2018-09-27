import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from './../../components/components.module';
import { FeesPage } from './fees';
import { ReversePipe } from './reverse.pipe';

@NgModule({
  declarations: [FeesPage, ReversePipe],
  imports: [
    IonicPageModule.forChild(FeesPage),
    ComponentsModule,
  ],
  entryComponents: [FeesPage],
})
export class FeesPageModule { }
