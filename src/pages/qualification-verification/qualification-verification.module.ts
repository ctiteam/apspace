import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QualificationVerificationPage } from './qualification-verification';

@NgModule({
  declarations: [
    QualificationVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(QualificationVerificationPage),
  ],
})
export class QualificationVerificationPageModule {}
