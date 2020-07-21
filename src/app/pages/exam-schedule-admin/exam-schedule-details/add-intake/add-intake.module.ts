import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CalendarModule } from 'ion2-calendar';

import { AddIntakePageRoutingModule } from './add-intake-routing.module';
import { AddIntakePage } from './add-intake.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddIntakePageRoutingModule,
    CalendarModule,
    ReactiveFormsModule
  ],
  declarations: [AddIntakePage]
})
export class AddIntakePageModule {}
