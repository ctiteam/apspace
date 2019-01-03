import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsultationFormPage } from './consultation-form';

@NgModule({
  declarations: [
    ConsultationFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ConsultationFormPage),

  ],
})
export class ConsultationFormPageModule { }
