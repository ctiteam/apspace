import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ElasticHeaderModule } from "ionic2-elastic-header/dist";
import { StaffDirectoryInfoPage } from './staff-directory-info';

@NgModule({
  declarations: [StaffDirectoryInfoPage],
  imports: [
    IonicPageModule.forChild(StaffDirectoryInfoPage),
    ElasticHeaderModule
  ],
  entryComponents: [StaffDirectoryInfoPage]
})
export class StaffDirectoryInfoPageModule { }
