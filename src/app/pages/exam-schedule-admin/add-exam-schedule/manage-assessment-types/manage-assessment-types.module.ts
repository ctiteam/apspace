import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageAssessmentTypesPageRoutingModule } from './manage-assessment-types-routing.module';

import { ManageAssessmentTypesPage } from './manage-assessment-types.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageAssessmentTypesPageRoutingModule
  ],
  declarations: [ManageAssessmentTypesPage]
})
export class ManageAssessmentTypesPageModule {}
