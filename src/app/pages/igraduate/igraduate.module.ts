import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

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
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [IgraduatePage, FilterPipe, StudentDetailsModalPage],
  entryComponents: [StudentDetailsModalPage]
})
export class IgraduatePageModule {}
