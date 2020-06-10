import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CalendarModule } from 'ion2-calendar';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedFormModule } from 'src/app/components/shared-form.module';
import { AddFreeSlotPage } from './add-free-slot.page';
const routes: Routes = [
  {
    path: '',
    component: AddFreeSlotPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CalendarModule,
    ComponentsModule,
    SharedFormModule
  ],
  declarations: [AddFreeSlotPage]
})
export class AddFreeSlotPageModule {}
