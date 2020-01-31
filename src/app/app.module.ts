import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { ActionSheet } from '@ionic-native/action-sheet/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { Device } from '@ionic-native/device/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { httpInterceptorProviders } from './http-interceptors';
import { RequestCache, RequestCacheWithMapStorage } from './services';
// import { Animation } from '@ionic/core';

// export function disableNavAnimation(AnimationC: Animation): Promise<Animation> { return Promise.resolve(new AnimationC()); }

import { Badge } from '@ionic-native/badge/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { Shake } from '@ionic-native/shake/ngx';
import { GraphQLModule } from './graphql.module';
import { ShakespearModalPageModule } from './pages/feedback/shakespear-modal/shakespear-modal.module';
import { ShakespearModalPage } from './pages/feedback/shakespear-modal/shakespear-modal.page';
import { NewsModalPageModule } from './pages/news/news-modal.module';
import { NotificationModalModule } from './pages/notifications/notification-modal.module';

@NgModule({
  // notificationPageModal is needed here because it is called in app.component.ts, NewsModal is called in dashboards also
  declarations: [AppComponent],
  entryComponents: [ShakespearModalPage],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(
      {
        backButtonText: '',
        // navAnimation: disableNavAnimation
      }
    ),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    GraphQLModule,
    NewsModalPageModule,
    NotificationModalModule,
    ShakespearModalPageModule
  ],
  providers: [
    ActionSheet,
    Badge,
    FCM,
    InAppBrowser,
    AppAvailability,
    Network,
    Device,
    Shake,
    Screenshot,
    StatusBar,
    Camera,
    File,
    Vibration,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: RequestCache, useClass: RequestCacheWithMapStorage },
    httpInterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
