import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClassesNewPage } from './classes-new.page';

import { ComponentsModule } from 'src/app/components/components.module';
import { ClasscodesFilterPipe } from './classcodes-filter.pipe';
import { TimeFrameFilterPipe } from './time-frame-filter.pipe';

const routes: Routes = [
  {
    path: '',
    component: ClassesNewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClassesNewPage, ClasscodesFilterPipe, TimeFrameFilterPipe]
})
export class ClassesNewPageModule {}
