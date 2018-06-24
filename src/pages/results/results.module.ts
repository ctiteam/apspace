import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartModule } from 'angular2-chartjs';
import { ElasticHeaderModule } from "ionic2-elastic-header/dist";

import { ResultsPage } from './results';

@NgModule({
  declarations: [ResultsPage],
  imports: [
    IonicPageModule.forChild(ResultsPage),
    ChartModule,
    ElasticHeaderModule
  ],
  entryComponents: [ResultsPage]
})
export class ResultsPageModule { }
