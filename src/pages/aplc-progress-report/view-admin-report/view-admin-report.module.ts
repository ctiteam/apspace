import { NgModule } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPageModule } from 'ionic-angular';

import { ViewAdminReportPage } from './view-admin-report';

@NgModule({
  declarations: [ViewAdminReportPage],
  imports: [
    IonicPageModule.forChild(ViewAdminReportPage),
  ],
  entryComponents: [ViewAdminReportPage],
  providers: [InAppBrowser],
})
export class LmsPageModule { }
