import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentConsentFormlPage } from './student-consent-form';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    StudentConsentFormlPage,
  ],
  imports: [
    IonicPageModule.forChild(StudentConsentFormlPage),
    ComponentsModule
  ]
})
export class StudentConsentFormlPageModule { }
