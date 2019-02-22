import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StudentTimetablePage } from './student-timetable.page';
import { IntakeSearchModalComponent } from './intake-search-modal.component';
import { ClassesPipe } from './classes.pipe';
import { ThedayPipe } from './theday.pipe';

const routes: Routes = [
  {
    path: '',
    component: StudentTimetablePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    StudentTimetablePage,
    IntakeSearchModalComponent,
    ClassesPipe,
    ThedayPipe
  ],
  entryComponents: [IntakeSearchModalComponent]
})
export class StudentTimetablePageModule {}
