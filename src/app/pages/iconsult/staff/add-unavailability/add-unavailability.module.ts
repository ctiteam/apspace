import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CalendarModule } from 'ion2-calendar';

import { AddUnavailabilityPage } from './add-unavailability.page';

const routes: Routes = [
  {
    path: '',
    component: AddUnavailabilityPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CalendarModule
  ],
  declarations: [AddUnavailabilityPage]
})
export class AddUnavailabilityPageModule {}
