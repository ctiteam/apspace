import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
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
