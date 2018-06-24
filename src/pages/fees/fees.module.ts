import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ElasticHeaderModule } from "ionic2-elastic-header/dist";
import { FeesPage } from './fees';

@NgModule({
  declarations: [
    FeesPage,
  ],
  imports: [
    IonicPageModule.forChild(FeesPage),
    ElasticHeaderModule
  ],

})
export class FeesPageModule { }
