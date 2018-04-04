import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { StaffDirectoryInfoPage } from './staff-directory-info';

@NgModule({
  declarations: [StaffDirectoryInfoPage],
  imports: [
    IonicPageModule.forChild(StaffDirectoryInfoPage),
  ],
  entryComponents: [StaffDirectoryInfoPage]
})
export class StaffDirectoryInfoPageModule { }
