import { ErrorHandler, NgModule } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicErrorHandler, IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { UpcomingConStuProvider } from '../../providers/upcoming-con-stu';
import { UpcomingstdPage } from './upcomingstd';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LaunchExternalAppProvider } from '../../providers';

@NgModule({
  declarations: [
    UpcomingstdPage,
  ],
  imports: [
    IonicPageModule.forChild(UpcomingstdPage),
    ComponentsModule,
  ], providers: [
    StatusBar,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UpcomingConStuProvider,
    InAppBrowser,
    LaunchExternalAppProvider
  ],

})
export class UpcomingstdPageModule { }
