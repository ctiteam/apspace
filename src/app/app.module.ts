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
import { IonicSelectableModule } from 'ionic-selectable';

import {
  AppAnimationProvider, BusTrackingProvider, CasTicketProvider,
  DataCollectorProvider, FeedbackProvider, httpInterceptorProviders,
  NotificationProvider, RequestCache, RequestCacheWithMapStorage, SettingsProvider,
  SlotsProvider, UpcomingConLecProvider, UpcomingConStuProvider,
  UserserviceProvider,
  UserSettingsProvider,
  WsApiProvider,  
} from '../providers';
import { MyApp } from './app.component';
import { AppAvailability } from '@ionic-native/app-availability';

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    IonicSelectableModule,
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
    SettingsProvider,
    BusTrackingProvider,
    FeedbackProvider,
    DataCollectorProvider,
    SlotsProvider,
    UserserviceProvider,
    UpcomingConLecProvider,
    UpcomingConStuProvider,
    AppAnimationProvider,
    UserSettingsProvider,
    AppAvailability
  ],
  entryComponents: [MyApp],
  bootstrap: [IonicApp],
})
export class AppModule { }
