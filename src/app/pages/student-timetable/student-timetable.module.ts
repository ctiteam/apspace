import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StudentTimetablePage } from './student-timetable.page';
import { ClassesPipe } from './classes.pipe';
import { ThedayPipe } from './theday.pipe';
import { ComponentsModule } from '../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: StudentTimetablePage
  },
  {
    path: ':intake',
    component: StudentTimetablePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ],
  declarations: [
    StudentTimetablePage,
    ClassesPipe,
    ThedayPipe,
  ],
  entryComponents: []
})
export class StudentTimetablePageModule { }
