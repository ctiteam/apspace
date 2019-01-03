import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentConsulDetailPage } from './student-consul-detail';

@NgModule({
  declarations: [
    StudentConsulDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(StudentConsulDetailPage),
  ],
})
export class StudentConsulDetailPageModule { }
