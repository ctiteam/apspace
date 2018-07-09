import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OperationHoursPage } from './operation-hours';

@NgModule({
  declarations: [
    OperationHoursPage,
  ],
  imports: [
    IonicPageModule.forChild(OperationHoursPage),
  ],
})
export class OperationHoursPageModule { }
