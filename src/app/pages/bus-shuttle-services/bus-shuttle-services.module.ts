import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BusShuttlePage } from './bus-shuttle-services.page';

const routes: Routes = [
  {
    path: '',
    component: BusShuttlePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BusShuttlePage]
})
export class BusShuttlePagePageModule { }
