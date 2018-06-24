import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartModule } from 'angular2-chartjs';
import { ElasticHeaderModule } from "ionic2-elastic-header/dist";

import { ApcardPage } from './apcard';
import { EntryPipe } from './entry.pipe';

@NgModule({
  declarations: [ApcardPage, EntryPipe],
  imports: [
    IonicPageModule.forChild(ApcardPage),
    ChartModule,
    ElasticHeaderModule
  ],
  entryComponents: [ApcardPage]
})
export class ApcardPageModule { }
