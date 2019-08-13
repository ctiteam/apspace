import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StaffDirectoryPage } from './staff-directory.page';
import { FusePipe } from '../../pipes/fuse.pipe';
import { DepartmentPipe } from './department.pipe';

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
    RouterModule.forChild(routes)
  ],
  declarations: [StaffDirectoryPage, FusePipe, DepartmentPipe]
})
export class StaffDirectoryPageModule { }
