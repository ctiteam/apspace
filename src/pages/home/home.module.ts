import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ElasticHeaderModule } from "ionic2-elastic-header/dist";

import { NewsProvider } from '../../providers';
import { HomePage } from './home';

@NgModule({
  declarations: [HomePage],
  imports: [
    IonicPageModule.forChild(HomePage),
    ElasticHeaderModule
  ],
  entryComponents: [HomePage],
  providers: [NewsProvider]
})
export class HomePageModule { }
