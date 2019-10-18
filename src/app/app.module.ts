import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { ActionSheet } from '@ionic-native/action-sheet/ngx';
import { Network } from '@ionic-native/network/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Device } from '@ionic-native/device/ngx';
import { NotificationModalPage } from './pages/notifications/notification-modal';
import { NewsModalPage } from './pages/news/news-modal';
// import { Animation } from '@ionic/core';

// export function disableNavAnimation(AnimationC: Animation): Promise<Animation> { return Promise.resolve(new AnimationC()); }

@NgModule({
  // notificationPageModal is needed here because it is called in app.component.ts, NewsModal is called in dashboards also
  declarations: [AppComponent, NotificationModalPage, NewsModalPage],
  entryComponents: [NotificationModalPage, NewsModalPage],
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
    AppRoutingModule
  ],
  providers: [
    ActionSheet,
    FCM,
    InAppBrowser,
    AppAvailability,
    Network,
    Device,
    StatusBar,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
