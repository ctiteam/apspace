import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClassesPage } from './classes.page';

import { ComponentsModule } from '../../../components/components.module';
import { GraphQLModule } from '../../../graphql.module';

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
    GraphQLModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClassesPage]
})
export class ClassesPageModule {}
