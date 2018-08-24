import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { Device } from '@ionic-native/device';
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Network } from '@ionic-native/network';
import { Push } from '@ionic-native/push';
import { StatusBar } from '@ionic-native/status-bar';
import { FCM } from '@ionic-native/fcm';
import { NetworkInterface } from '@ionic-native/network-interface';
import { Badge } from '@ionic-native/badge';

import { MyApp } from './app.component';
import {
  BusTrackingProvider, CasTicketProvider, LoadingControllerProvider,
  NotificationProvider, OperationHoursProvider, RequestCache,
  RequestCacheWithMapStorage, WsApiProvider, httpInterceptorProviders,
  SettingsProvider, FeedbackProvider, DataCollectorProvider, ApiApiitProvider
} from '../providers';

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    EmailComposer,
    Device,
    NetworkInterface,
    InAppBrowser,
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
    LoadingControllerProvider,
    SettingsProvider,
    BusTrackingProvider,
    FeedbackProvider,
    DataCollectorProvider,
    ApiApiitProvider
  ]
})
export class AppModule { }
