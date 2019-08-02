import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClassroomFinderPage } from './classroom-finder.page';
import { RoomsPipe } from './rooms.pipe';
import { AtPipe } from './at.pipe';
import { OnPipe } from './on.pipe';
import { TimePipe } from './time.pipe';
import { ForPipe } from './for.pipe';

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
    RouterModule.forChild(routes)
  ],
  declarations: [ClassroomFinderPage, RoomsPipe, AtPipe, OnPipe, TimePipe, ForPipe]
})
export class ClassroomFinderPageModule {}
