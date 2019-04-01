import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QualificationVerificationPage } from './qualification-verification';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    QualificationVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(QualificationVerificationPage),
    ComponentsModule
  ],
  providers: [InAppBrowser],
})
export class QualificationVerificationPageModule {}
