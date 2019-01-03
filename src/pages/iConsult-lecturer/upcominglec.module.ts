import { ErrorHandler, NgModule } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicErrorHandler, IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { UpcomingConLecProvider } from '../../providers/upcoming-con-lec';
import { UpcominglecPage } from './upcominglec';

@NgModule({
  declarations: [
    UpcominglecPage,
  ],
  imports: [
    IonicPageModule.forChild(UpcominglecPage),
    ComponentsModule,
  ],
  providers: [
    StatusBar,
    { provide: ErrorHandler, useClass: IonicErrorHandler }, UpcomingConLecProvider,
  ],
})
export class UpcominglecPageModule { }
