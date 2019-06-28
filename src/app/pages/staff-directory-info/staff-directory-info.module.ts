import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StaffDirectoryInfoPage } from './staff-directory-info.page';
import { UrldecodePipe } from '../../pipes/urldecode.pipe';

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
    RouterModule.forChild(routes)
  ],
  declarations: [StaffDirectoryInfoPage, UrldecodePipe]
})
export class StaffDirectoryInfoPageModule { }
