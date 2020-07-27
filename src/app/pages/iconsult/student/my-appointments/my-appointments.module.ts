import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { SharedPipesModule } from 'src/app/shared/shared-pipes.module';
import { MyAppointmentsPage } from './my-appointments.page';
import { SlotDetailsModalPage } from './slot-details-modal';

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
    SharedPipesModule
  ],
  declarations: [MyAppointmentsPage, SlotDetailsModalPage],
})
export class MyAppointmentsPageModule {}
