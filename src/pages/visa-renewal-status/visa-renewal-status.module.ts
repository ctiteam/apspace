import { VisaRenewalStatusPage } from './visa-renewal-status';
import { NgModule } from '@angular/core';
import { ActionSheet } from '@ionic-native/action-sheet';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from './../../components/components.module';
import { ChartModule } from 'angular2-chartjs';




@NgModule({
  declarations: [
    VisaRenewalStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(VisaRenewalStatusPage),
    RoundProgressModule,
    ComponentsModule,
    ChartModule
  ],
  providers: [ActionSheet],
})
export class VisaRenewalStatusPageModule {}
