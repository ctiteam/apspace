import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QualificationVerificationPage } from './qualification-verification';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    QualificationVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(QualificationVerificationPage),
  ],
  providers: [InAppBrowser],
})
export class QualificationVerificationPageModule {}
