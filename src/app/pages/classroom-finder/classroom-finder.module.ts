import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedPipesModule } from 'src/app/shared/shared-pipes.module';
import { AtPipe } from './at.pipe';
import { ClassroomFinderPage } from './classroom-finder.page';
import { ForPipe } from './for.pipe';
import { OnPipe } from './on.pipe';

const routes: Routes = [
  {
    path: '',
    component: ClassroomFinderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedPipesModule
  ],
  declarations: [ClassroomFinderPage, AtPipe, ForPipe, OnPipe]
})
export class ClassroomFinderPageModule {}
