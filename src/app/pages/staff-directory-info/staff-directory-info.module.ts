import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { AppLauncherService } from 'src/app/services';
import { LecturerTimetableComponentModule } from '../../components/lecturer-timetable/lecturer-timetable.module';
import { UrldecodePipe } from '../../pipes/urldecode.pipe';
import { ByIdPipe } from './by-id.pipe';
import { StaffDirectoryInfoPage } from './staff-directory-info.page';

const routes: Routes = [
  {
    path: ':id',
    component: StaffDirectoryInfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    LecturerTimetableComponentModule
  ],
  providers: [AppLauncherService],
  declarations: [StaffDirectoryInfoPage, UrldecodePipe, ByIdPipe]
})
export class StaffDirectoryInfoPageModule { }
