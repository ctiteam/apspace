import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChartModule } from 'angular2-chartjs';
import { CalendarModule } from 'ion2-calendar';
import { ComponentsModule } from 'src/app/components/components.module';
import { FilterSlotsPipe } from './filter-slots.pipe';
import { LecturerSlotDetailsModalPage } from './modals/lecturer-slot-details/lecturer-slot-details-modal';
import { ConsultationsSummaryModalPage } from './modals/summary/summary-modal';
import { UnavailabilityDetailsModalPage } from './modals/unavailability-details/unavailability-details-modal';
import { MyConsultationsPage } from './my-consultations.page';

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
