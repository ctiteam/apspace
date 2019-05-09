import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicErrorHandler, IonicPageModule } from 'ionic-angular';
import { UserserviceProvider, LaunchExternalAppProvider } from '../../providers';
import { ConsuldetailpagePage } from './consuldetailpage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    ConsuldetailpagePage,
  ],
  imports: [
    IonicPageModule.forChild(ConsuldetailpagePage),
    HttpModule,
  ],
  providers: [
    StatusBar,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserserviceProvider,
    InAppBrowser,
    LaunchExternalAppProvider
  ],
})
export class ConsuldetailpagePageModule { }
