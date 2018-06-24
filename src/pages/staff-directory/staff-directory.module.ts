import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ElasticHeaderModule } from "ionic2-elastic-header/dist";

import { StaffDirectoryPage } from './staff-directory';
import { DepartmentPipe } from './department.pipe';
import { SearchPipe } from './search.pipe';

@NgModule({
  declarations: [StaffDirectoryPage, DepartmentPipe, SearchPipe],
  imports: [
    IonicPageModule.forChild(StaffDirectoryPage),
    ElasticHeaderModule
  ],
  entryComponents: [StaffDirectoryPage]
})
export class StaffDirectoryPageModule { }
