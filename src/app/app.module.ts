import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Badge } from '@ionic-native/badge';
import { Device } from '@ionic-native/device';
import { EmailComposer } from '@ionic-native/email-composer';
import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Network } from '@ionic-native/network';
import { NetworkInterface } from '@ionic-native/network-interface';
import { Push } from '@ionic-native/push';
import { StatusBar } from '@ionic-native/status-bar';

import {
  BusTrackingProvider, CasTicketProvider, DataCollectorProvider,
  EventsProvider, FeedbackProvider, httpInterceptorProviders,
  NotificationProvider, OperationHoursProvider, RequestCache,
  RequestCacheWithMapStorage, SettingsProvider, WsApiProvider,
} from '../providers';
import { MyApp } from './app.component';

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  providers: [
    StatusBar,
    EmailComposer,
    Device,
    NetworkInterface,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Network,
    CasTicketProvider,
    Push,
    FCM,
    Badge,
    LocalNotifications,
    WsApiProvider,
    NotificationProvider,
    { provide: RequestCache, useClass: RequestCacheWithMapStorage },
    httpInterceptorProviders,
    OperationHoursProvider,
    SettingsProvider,
    BusTrackingProvider,
    FeedbackProvider,
    DataCollectorProvider,
    EventsProvider,
  ],
  entryComponents: [MyApp],
  bootstrap: [IonicApp],
})
export class AppModule { }
