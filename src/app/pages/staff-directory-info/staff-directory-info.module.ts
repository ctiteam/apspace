import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StaffDirectoryInfoPage } from './staff-directory-info.page';
import { UrldecodePipe } from '../../pipes/urldecode.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { LecturerTimetableComponent } from 'src/app/components/lecturer-timetable/lecturer-timetable.component';

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
    ComponentsModule
  ],
  declarations: [StaffDirectoryInfoPage, UrldecodePipe]
})
export class StaffDirectoryInfoPageModule { }
