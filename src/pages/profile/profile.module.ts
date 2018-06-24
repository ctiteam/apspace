import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ElasticHeaderModule } from "ionic2-elastic-header/dist";

import { ProfilePage } from './profile';

@NgModule({
  declarations: [ProfilePage],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    ElasticHeaderModule
  ],
  entryComponents: [ProfilePage]
})
export class ProfilePageModule {}
