import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HOMEPage } from '../pages/h-ome/h-ome';
import { TIMETABLEPage } from '../pages/t-imetable/t-imetable';
import { RESULTSPage } from '../pages/r-esults/r-esults';
import { FEESPage } from '../pages/f-ees/f-ees';
import { NOTIFICATIONPage } from '../pages/n-otification/n-otification';
import { FEEDBACKPage } from '../pages/f-eedback/f-eedback';
import { LOGINPage } from '../pages/l-ogin/l-ogin';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FeedServiceProvider } from '../providers/feed-service/feed-service';
import { TimetableDataProvider } from '../providers/timetable-data/timetable-data';
import { ResultProvider } from '../providers/result/result-data';

import { Camera } from '@ionic-native/camera';
import { EmailComposer } from '@ionic-native/email-composer';

import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    MyApp,
    HOMEPage,
    TIMETABLEPage,
    RESULTSPage,
    FEESPage,
    NOTIFICATIONPage,
    FEEDBACKPage,
    LOGINPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HOMEPage,
    TIMETABLEPage,
    RESULTSPage,
    FEESPage,
    NOTIFICATIONPage,
    FEEDBACKPage,
    LOGINPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    EmailComposer,
    Camera,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FeedServiceProvider,
    TimetableDataProvider,
    ResultProvider
  ]
    
})
export class AppModule {}