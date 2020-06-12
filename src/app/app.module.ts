import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { ActionSheet } from '@ionic-native/action-sheet/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Device } from '@ionic-native/device/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { Shake } from '@ionic-native/shake/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { httpInterceptorProviders } from './http-interceptors';
import { ShakespearModalPageModule } from './pages/feedback/shakespear-modal/shakespear-modal.module';
import { NewsModalPageModule } from './pages/news/news-modal.module';
import { NotificationModalModule } from './pages/notifications/notification-modal.module';
import { RequestCache, RequestCacheWithMapStorage } from './services';
// import { Animation } from '@ionic/core';

// export function disableNavAnimation(AnimationC: Animation): Promise<Animation> { return Promise.resolve(new AnimationC()); }

@NgModule({
  // notificationPageModal is needed here because it is called in app.component.ts, NewsModal is called in dashboards also
  declarations: [AppComponent],
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
    NewsModalPageModule,
    NotificationModalModule,
    ShakespearModalPageModule
  ],
  providers: [
    ActionSheet,
    Badge,
    FirebaseX,
    InAppBrowser,
    AppAvailability,
    Network,
    Device,
    Shake,
    Screenshot,
    StatusBar,
    Camera,
    File,
    FileOpener,
    // tslint:disable-next-line
    FileTransfer,
    DocumentViewer,
    Deeplinks,
    Vibration,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: RequestCache, useClass: RequestCacheWithMapStorage },
    httpInterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
