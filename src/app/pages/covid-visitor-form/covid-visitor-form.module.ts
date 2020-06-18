import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CovidVisitorFormPageRoutingModule } from './covid-visitor-form-routing.module';

import { CovidVisitorFormPage } from './covid-visitor-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CovidVisitorFormPageRoutingModule
  ],
  declarations: [CovidVisitorFormPage]
})
export class CovidVisitorFormPageModule {}
