import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MaintenanceAndUpdatePage } from './maintenance-and-update.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceAndUpdatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MaintenanceAndUpdatePage]
})
export class MaintenanceAndUpdatePageModule {}
