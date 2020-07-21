import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
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
