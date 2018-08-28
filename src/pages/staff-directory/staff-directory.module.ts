import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { DepartmentPipe } from './department.pipe';
import { SearchPipe } from './search.pipe';
import { StaffDirectoryPage } from './staff-directory';

@NgModule({
  declarations: [StaffDirectoryPage, DepartmentPipe, SearchPipe],
  imports: [
    IonicPageModule.forChild(StaffDirectoryPage),
  ],
  entryComponents: [StaffDirectoryPage],
})
export class StaffDirectoryPageModule { }
