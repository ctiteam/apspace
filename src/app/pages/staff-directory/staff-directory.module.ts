import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { SharedPipesModule } from '../../shared/shared-pipes.module';
import { DepartmentPipe } from './department.pipe';
import { StaffDirectoryPage } from './staff-directory.page';

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
    SharedPipesModule,
    ComponentsModule
  ],
  declarations: [StaffDirectoryPage, DepartmentPipe]
})
export class StaffDirectoryPageModule { }
