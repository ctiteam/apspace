import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../../components/components.module';
import { AttendanceIntegrityModalPage } from './attendance-integrity/attendance-integrity-modal';
import { ClasscodesFilterPipe } from './classcodes-filter.pipe';
import { ClassesPage } from './classes.page';
import { ConfirmClassCodeModalPage } from './confirm-class-code/confirm-class-code-modal';

const routes: Routes = [
  {
    path: '',
    component: ClassesPage
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
  declarations: [ClassesPage, ClasscodesFilterPipe, ConfirmClassCodeModalPage, AttendanceIntegrityModalPage],
})
export class ClassesPageModule {}
