import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExamSchedulePage } from './exam-schedule.page';
import { SearchModalComponent } from '../../components/search-modal/search-modal.component';
import { IntakeListingService } from 'src/app/services';


const routes: Routes = [
  {
    path: '',
    component: ExamSchedulePage
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
  providers: [IntakeListingService],
  declarations: [
    ExamSchedulePage,
    SearchModalComponent,
  ],
  entryComponents: [SearchModalComponent]
})
export class ExamSchedulePageModule {}
