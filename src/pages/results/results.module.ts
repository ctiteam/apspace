import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartModule } from 'angular2-chartjs';

import { ResultsPage } from './results';

@NgModule({
  declarations: [ResultsPage],
  imports: [
    IonicPageModule.forChild(ResultsPage),
    ChartModule,
  ],
  entryComponents: [ResultsPage]
})
export class ResultsPageModule { }
