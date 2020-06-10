import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { FormCardComponent } from './form/form-card/form-card.component';
import { FormItemComponent } from './form/form-item/form-item.component';
import { FormSectionComponent } from './form/form-section/form-section.component';

@NgModule({
  declarations: [
    FormCardComponent,
    FormSectionComponent,
    FormItemComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    FormCardComponent,
    FormSectionComponent,
    FormItemComponent
  ]
})
export class SharedFormModule { }
