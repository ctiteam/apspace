import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClassesNewPage } from './classes-new.page';
import { ClassesPage } from './classes.page';

import { ComponentsModule } from '../../../components/components.module';
import { AttendixNewGuard } from '../attendix-new.guard';
import { AttendanceIntegrityModalPage } from './attendance-integrity/attendance-integrity-modal';
import { ClasscodesFilterPipe } from './classcodes-filter.pipe';
import { ConfirmClassCodeModalPage } from './confirm-class-code/confirm-class-code-modal';

const routes: Routes = [
  {
    path: '',
    component: ClassesPage,
    canActivate: [AttendixNewGuard]
  },
  {
    path: 'new',
    component: ClassesNewPage,
    canActivate: [AttendixNewGuard]
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
  declarations: [ClassesPage, ClassesNewPage, ClasscodesFilterPipe, ConfirmClassCodeModalPage, AttendanceIntegrityModalPage],
  entryComponents: [ConfirmClassCodeModalPage, AttendanceIntegrityModalPage]
})
export class ClassesPageModule {}
