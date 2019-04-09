import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentConsentFormlPage } from './student-consent-form';

@NgModule({
  declarations: [
    StudentConsentFormlPage,
  ],
  imports: [
    IonicPageModule.forChild(StudentConsentFormlPage),
  ],
})
export class StudentConsentFormlPageModule { }
