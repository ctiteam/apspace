import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http'; // TODO: switch to HttpClientModule
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { JsonpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';

import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Network } from '@ionic-native/network';
import { Firebase } from '@ionic-native/firebase';
import { Push } from '@ionic-native/push';
import { LocalNotifications } from '@ionic-native/local-notifications';
import {
  CasTicketProvider, RequestCache,
  RequestCacheWithMapStorage, WsApiProvider, httpInterceptorProviders, NotificationServiceProvider, OperationHoursProvider
} from '../providers';

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    JsonpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    EmailComposer,
    InAppBrowser,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Network,
    CasTicketProvider,
    Firebase,
    Push,
    LocalNotifications,
    WsApiProvider,
    NotificationServiceProvider,
    { provide: RequestCache, useClass: RequestCacheWithMapStorage },
    httpInterceptorProviders,
    OperationHoursProvider,
  ]
})
export class AppModule { }
