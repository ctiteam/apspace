import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StaffDirectoryPage } from './staff-directory.page';
import { DepartmentPipe } from './department.pipe';
import { FuseModule } from '../../shared/fuse/fuse.module';

const routes: Routes = [
  {
    path: '',
    component: StaffDirectoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FuseModule
  ],
  declarations: [StaffDirectoryPage, DepartmentPipe]
})
export class StaffDirectoryPageModule { }
