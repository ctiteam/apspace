import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ReversePipe } from '../../../shared/reverse/reverse.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { ShowDetailsPage } from './show-details/show-details.page';
import { ViewStudentPage } from './view-student.page';

const routes: Routes = [
  {
    path: '',
    component: ViewStudentPage
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
  declarations: [ViewStudentPage, ShowDetailsPage, ReversePipe, FilterPipe, SearchPipe],
  entryComponents: [ShowDetailsPage]
})
export class ViewStudentPageModule {}
