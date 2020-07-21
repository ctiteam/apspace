import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { ResetWebspacePasswordPage } from './reset-webspace-password.page';

const routes: Routes = [
  {
    path: '',
    component: ResetWebspacePasswordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicStorageModule.forRoot(),
  ],
  declarations: [ResetWebspacePasswordPage]
})
export class ResetWebspacePasswordPageModule {}
