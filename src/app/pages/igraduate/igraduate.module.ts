import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { FilterPipe } from './filter.pipe';
import { IgraduatePage } from './igraduate.page';
import { StudentDetailsModalPage } from './student-details-modal';

const routes: Routes = [
  {
    path: '',
    component: IgraduatePage
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
  declarations: [IgraduatePage, FilterPipe, StudentDetailsModalPage],
})
export class IgraduatePageModule {}
