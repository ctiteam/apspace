import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OperationHoursPage } from './operation-hours.page';
import { TimePipe } from './time.pipe';

const routes: Routes = [
  {
    path: '',
    component: OperationHoursPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OperationHoursPage, TimePipe]
})
export class OperationHoursPageModule {}
