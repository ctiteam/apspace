import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { MentorshipPage } from './mentorship.page';
import { FilterPipe } from './pipes/filter.pipe';
import { SearchPipe } from './pipes/search.pipe';

const routes: Routes = [
  {
    path: '',
    component: MentorshipPage,
  },
  {
    path: ':tp/:intake/view',
    loadChildren: () => import('./view-student/view-student.module')
      .then(m => m.ViewStudentPageModule)
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
  declarations: [MentorshipPage, SearchPipe, FilterPipe]
})
export class MentorshipPageModule {}
