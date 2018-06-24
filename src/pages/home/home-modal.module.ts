import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ElasticHeaderModule } from "ionic2-elastic-header/dist";
import { HomeModalPage } from './home-modal';

@NgModule({
  declarations: [
    HomeModalPage
  ],
  imports: [
    IonicPageModule.forChild(HomeModalPage),
    ElasticHeaderModule
  ],
})
export class HomeModalPageModule { }
