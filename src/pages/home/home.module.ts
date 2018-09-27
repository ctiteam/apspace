import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { NewsProvider } from '../../providers';
import { ComponentsModule } from './../../components/components.module';
import { HomePage } from './home';

@NgModule({
  declarations: [HomePage],
  imports: [
    IonicPageModule.forChild(HomePage),
    ComponentsModule,
  ],
  entryComponents: [HomePage],
  providers: [NewsProvider],
})
export class HomePageModule { }
