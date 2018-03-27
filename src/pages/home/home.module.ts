import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { NewsProvider } from '../../providers';
import { HomePage } from './home';

@NgModule({
  declarations: [HomePage],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  entryComponents: [HomePage],
  providers: [NewsProvider]
})
export class HomePageModule {}
