import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StaffDirectoryPage } from './staff-directory.page';
import { DepartmentPipe } from './department.pipe';
import { SearchPipe } from './search.pipe';

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
  declarations: [StaffDirectoryPage, DepartmentPipe, SearchPipe]
})
export class StaffDirectoryPageModule {}
