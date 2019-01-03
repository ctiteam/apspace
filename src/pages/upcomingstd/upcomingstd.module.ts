import { ErrorHandler, NgModule } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicErrorHandler, IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { UpcomingConStuProvider } from '../../providers/upcoming-con-stu';
import { UpcomingstdPage } from './upcomingstd';

@NgModule({
  declarations: [
    UpcomingstdPage,
  ],
  imports: [
    IonicPageModule.forChild(UpcomingstdPage),
    ComponentsModule,
  ], providers: [
    StatusBar,
    { provide: ErrorHandler, useClass: IonicErrorHandler }, UpcomingConStuProvider,
  ],
})
export class UpcomingstdPageModule { }
