import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CalendarModule } from 'ion2-calendar';
import { ComponentsModule } from 'src/app/components/components.module';
import { BookSlotModalPage } from './book-slot-modal';
import { CalendarFilterModalPage } from './calendar-filter-modal/calendar-filter-modal';
import { FilterSlotsByDayPipe } from './filter-slots-by-day.pipe';
import { OpenedSlotsPage } from './opened-slots.page';

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
