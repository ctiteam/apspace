import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddFreeSlotPage } from './add-free-slot.page';
import { CalendarModule } from 'ion2-calendar';
import { IonicSelectableModule } from 'ionic-selectable';
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
    IonicSelectableModule
  ],
  declarations: [AddFreeSlotPage]
})
export class AddFreeSlotPageModule {}
