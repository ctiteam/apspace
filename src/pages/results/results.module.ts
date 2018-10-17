import { NgModule } from '@angular/core';
import { ActionSheet } from '@ionic-native/action-sheet';
import { ChartModule } from 'angular2-chartjs';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from './../../components/components.module';
import { ResultsPage } from './results';

@NgModule({
  declarations: [
    ResultsPage,
  ],
  imports: [
    IonicPageModule.forChild(ResultsPage),
    ChartModule,
    ComponentsModule,
  ],
  entryComponents: [ResultsPage],
  providers: [ActionSheet],
})
export class ResultsPageModule { }
