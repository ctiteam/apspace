import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyAppointmentsPage } from './my-appointments.page';
import { SlotDetailsModalPage } from './slot-details-modal';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: MyAppointmentsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ],
  declarations: [MyAppointmentsPage, SlotDetailsModalPage],
  entryComponents: [SlotDetailsModalPage]
})
export class MyAppointmentsPageModule {}
