import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CovidVisitorSessionPassPageRoutingModule } from './covid-visitor-session-pass-routing.module';

import { CovidVisitorSessionPassPage } from './covid-visitor-session-pass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CovidVisitorSessionPassPageRoutingModule
  ],
  declarations: [CovidVisitorSessionPassPage]
})
export class CovidVisitorSessionPassPageModule {}
