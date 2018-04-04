import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { StaffDirectoryPage } from './staff-directory';

@NgModule({
  declarations: [StaffDirectoryPage],
  imports: [
    IonicPageModule.forChild(StaffDirectoryPage),
  ],
  entryComponents: [StaffDirectoryPage]
})
export class StaffDirectoryPageModule { }
