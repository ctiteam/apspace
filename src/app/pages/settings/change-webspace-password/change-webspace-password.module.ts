import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ChangeWebspacePasswordPage } from './change-webspace-password.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeWebspacePasswordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChangeWebspacePasswordPage]
})
export class ChangeWebspacePasswordPageModule {}
