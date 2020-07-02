import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ComponentsModule } from '../../components/components.module';
import { OperationHoursFilterPipe } from './operation-hours-filter/operation-hours-filter.pipe';
import { TimeFormatterPipe } from './time-formatter/time-formatter.pipe';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  providers: [
    InAppBrowser
  ],
  declarations: [LoginPage, OperationHoursFilterPipe, TimeFormatterPipe]
})
export class LoginPageModule { }
