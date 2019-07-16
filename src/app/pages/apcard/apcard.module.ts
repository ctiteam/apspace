import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ApcardPage } from './apcard.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule } from '@angular/forms';
import { FilterPipe, MonthFilter, YearFilter } from './filter.pipe';

const routes: Routes = [
  {
    path: '',
    component: ApcardPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    FormsModule
  ],
  declarations: [
    ApcardPage,
    FilterPipe,
    MonthFilter,
    YearFilter,
  ]
})
export class ApcardPageModule { }
