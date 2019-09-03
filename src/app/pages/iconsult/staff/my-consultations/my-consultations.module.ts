import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyConsultationsPage } from './my-consultations.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { CalendarModule } from 'ion2-calendar';
import { FilterSlotsPipe } from './filter-slots.pipe';
import { ConsultationsSummaryModalPage } from './modals/summary/summary-modal';
import { LecturerSlotDetailsModalPage } from './modals/lecturer-slot-details/lecturer-slot-details-modal';
import { ChartModule } from 'angular2-chartjs';
import { UnavailabilityDetailsModalPage } from './modals/unavailability-details/unavailability-details-modal';

const routes: Routes = [
  {
    path: '',
    component: MyConsultationsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    ChartModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    MyConsultationsPage,
    FilterSlotsPipe,
    ConsultationsSummaryModalPage,
    LecturerSlotDetailsModalPage,
    UnavailabilityDetailsModalPage
  ],
  entryComponents: [ConsultationsSummaryModalPage, LecturerSlotDetailsModalPage, UnavailabilityDetailsModalPage],

})
export class MyConsultationsPageModule {}
