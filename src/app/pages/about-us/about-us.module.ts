import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { AboutUsPage } from './about-us.page';

const routes: Routes = [
  {
    path: '',
    component: AboutUsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    IonicModule,
  ],
  declarations: [AboutUsPage]
})
export class AboutUsPageModule { }
