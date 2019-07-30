import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SetSecurityQuestionsPage } from './set-security-questions.page';

const routes: Routes = [
  {
    path: '',
    component: SetSecurityQuestionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SetSecurityQuestionsPage]
})
export class SetSecurityQuestionsPageModule {}
