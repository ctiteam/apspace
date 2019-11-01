import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { FilterByCompanyPipe } from './filter-by-company.pipe';
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
    ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OperationHoursPage, TimePipe, FilterByCompanyPipe]
})
export class OperationHoursPageModule {}
