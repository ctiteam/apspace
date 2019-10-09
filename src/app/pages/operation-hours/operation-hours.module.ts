import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OperationHoursPage } from './operation-hours.page';
import { TimePipe } from './time.pipe';
import { FilterByCompanyPipe } from './filter-by-company.pipe';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: OperationHoursPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OperationHoursPage, TimePipe, FilterByCompanyPipe]
})
export class OperationHoursPageModule {}
