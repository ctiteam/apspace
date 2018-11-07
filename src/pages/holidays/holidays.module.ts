import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { HolidaysPage } from './holidays';
import { FilterRolePipe } from './filter-role.pipe';

@NgModule({
  declarations: [
    HolidaysPage,
    FilterRolePipe,
  ],
  imports: [
    IonicPageModule.forChild(HolidaysPage),
    ComponentsModule,
  ],
})
export class HolidaysPageModule { }
