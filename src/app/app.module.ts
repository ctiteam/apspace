import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'; // TODO: switch to HttpClientModule
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HOMEPage } from '../pages/h-ome/h-ome';
import { RESULTSPage } from '../pages/r-esults/r-esults';
import { FEESPage } from '../pages/f-ees/f-ees';
import { NOTIFICATIONPage } from '../pages/n-otification/n-otification';
import { FEEDBACKPage } from '../pages/f-eedback/f-eedback';
import { LOGINPage } from '../pages/l-ogin/l-ogin';
import { WelcomePage} from '../pages/welcome/welcome';

import { JsonpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';

import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FeedServiceProvider } from '../providers/feed-service/feed-service';
import { Network } from '@ionic-native/network';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { StaffDirectoryProvider } from '../providers/staff-directory/staff-directory';
import { CasTicketProvider } from '../providers/cas-ticket/cas-ticket';
import { TimetableProvider } from '../providers/timetable/timetable';
import { ScrollableTabs } from '../components/scrollable-tabs/scrollable-tabs';
import { Firebase } from '@ionic-native/firebase';
import { Push } from '@ionic-native/push';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';




@NgModule({
  declarations: [
    MyApp,
    HOMEPage,
    RESULTSPage,
    FEESPage,
    NOTIFICATIONPage,
    FEEDBACKPage,
    LOGINPage,
    WelcomePage,
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
    HOMEPage,
    RESULTSPage,
    FEESPage,
    NOTIFICATIONPage,
    FEEDBACKPage,
    LOGINPage,
    WelcomePage,
  ],
  providers: [
    StatusBar,
    EmailComposer,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FeedServiceProvider,
    Network,
    StaffDirectoryProvider,
    CasTicketProvider,
    TimetableProvider,
    Firebase,
    Push,
    LocalNotifications,
    AuthServiceProvider
  ]

})
export class AppModule {}
