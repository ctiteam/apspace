import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'; // TODO: switch to HttpClientModule
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ResultsPage } from '../pages/results/results';
import { FeesPage } from '../pages/fees/fees';
import { NotificationPage } from '../pages/notification/notification';
import { FeedbackPage } from '../pages/feedback/feedback';
import { LoginPage } from '../pages/login/login';

import { JsonpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';

import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FeedServiceProvider } from '../providers/feed-service/feed-service';
import { Network } from '@ionic-native/network';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { CasTicketProvider } from '../providers/cas-ticket/cas-ticket';
import { ScrollableTabs } from '../components/scrollable-tabs/scrollable-tabs';
import { Firebase } from '@ionic-native/firebase';
import { Push } from '@ionic-native/push';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { WsApiProvider } from '../providers/ws-api/ws-api';
import { UserProfile } from '../interfaces/user-pofile';
import { UserPhoto } from '../interfaces/user-photo';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ResultsPage,
    FeesPage,
    NotificationPage,
    FeedbackPage,
    LoginPage,
    ScrollableTabs,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    JsonpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ResultsPage,
    FeesPage,
    NotificationPage,
    FeedbackPage,
    LoginPage,
  ],
  providers: [
    StatusBar,
    EmailComposer,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FeedServiceProvider,
    Network,
    CasTicketProvider,
    Firebase,
    Push,
    LocalNotifications,
    AuthServiceProvider,
    WsApiProvider,
  ]

})
export class AppModule {}
