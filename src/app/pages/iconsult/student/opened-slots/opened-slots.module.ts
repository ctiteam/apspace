import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OpenedSlotsPage } from './opened-slots.page';
import { BookSlotModalPage } from './book-slot-modal';

const routes: Routes = [
  {
    path: '',
    component: OpenedSlotsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OpenedSlotsPage, BookSlotModalPage],
  entryComponents: [BookSlotModalPage],
})
export class OpenedSlotsPageModule {}
