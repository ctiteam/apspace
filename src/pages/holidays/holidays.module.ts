import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { FilterRolePipe } from './filter-role.pipe';
import { HolidaysPage } from './holidays';

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
