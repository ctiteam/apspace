import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../components/components.module';
import { StaffDirectoryInfoPage } from './staff-directory-info';
import { UrlDecodePipe } from './urldecode.pipe';

@NgModule({
  declarations: [StaffDirectoryInfoPage, UrlDecodePipe],
  imports: [
    IonicPageModule.forChild(StaffDirectoryInfoPage),
    ComponentsModule,
  ],
  entryComponents: [StaffDirectoryInfoPage],
})
export class StaffDirectoryInfoPageModule { }
