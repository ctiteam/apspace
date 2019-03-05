import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StudentTimetablePage } from './student-timetable.page';
import { ClassesPipe } from './classes.pipe';
import { ThedayPipe } from './theday.pipe';
import { SearchModalComponent } from '../components/search-modal/search-modal.component';

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
    ClassesPipe,
    ThedayPipe,
    SearchModalComponent
  ],
  entryComponents: [SearchModalComponent]
})
export class StudentTimetablePageModule {}
