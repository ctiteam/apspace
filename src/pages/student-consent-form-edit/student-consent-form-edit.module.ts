import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentConsentFormEditPage } from './student-consent-form-edit';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    StudentConsentFormEditPage,
  ],
  imports: [
    IonicPageModule.forChild(StudentConsentFormEditPage),
    ComponentsModule
  ]
})
export class StudentConsentFormlPageModule { }
