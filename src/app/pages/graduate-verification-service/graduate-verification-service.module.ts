import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { GraduateVerificationServicePage } from './graduate-verification-service.page';

const routes: Routes = [
  {
    path: '',
    component: GraduateVerificationServicePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GraduateVerificationServicePage],
  providers: [
    InAppBrowser
  ],
})
export class GraduateVerificationServicePageModule {}
