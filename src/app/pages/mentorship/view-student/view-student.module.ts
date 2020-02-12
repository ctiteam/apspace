import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedPipesModule } from 'src/app/shared/shared-pipes.module';
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
    SharedPipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewStudentPage, ShowDetailsPage, FilterPipe, SearchPipe],
})
export class ViewStudentPageModule {}
