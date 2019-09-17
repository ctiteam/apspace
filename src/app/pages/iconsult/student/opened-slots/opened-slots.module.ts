import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OpenedSlotsPage } from './opened-slots.page';
import { BookSlotModalPage } from './book-slot-modal';
import { ComponentsModule } from 'src/app/components/components.module';
import { CalendarModule } from 'ion2-calendar';
import { FilterSlotsByDayPipe } from './filter-slots-by-day.pipe';
import { CalendarFilterModalPage } from './calendar-filter-modal/calendar-filter-modal';

const routes: Routes = [
  {
    path: '',
    component: OpenedSlotsPage
  }
];

@NgModule({
  imports: [
    CalendarModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [OpenedSlotsPage, BookSlotModalPage, CalendarFilterModalPage, FilterSlotsByDayPipe],
  entryComponents: [BookSlotModalPage, CalendarFilterModalPage],
})
export class OpenedSlotsPageModule {}
