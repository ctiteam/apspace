import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { ActionSheet } from '@ionic-native/action-sheet/ngx';
import { Network } from '@ionic-native/network/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UrldecodePipe } from './pipes/urldecode.pipe';
import { QrScanComponent } from './attendix-student/qr-scan/qr-scan.component';
import { TakePictureComponent } from './attendix-student/take-picture/take-picture.component';
import { UseOtpComponent } from './attendix-student/use-otp/use-otp.component';
import { MarkAttendanceComponent } from './attendix-student/mark-attendance/mark-attendance.component';
import { AttendanceMarkedSuccessfullyComponent } from './attendix-student/attendance-marked-successfully/attendance-marked-successfully.component';
import { ListOfClassesComponent } from './attendix-lecturer/list-of-classes/list-of-classes.component';
import { EditClassDetailsComponent } from './attendix-lecturer/edit-class-details/edit-class-details.component';
import { TakeAttendanceComponent } from './attendix-lecturer/take-attendance/take-attendance.component';

@NgModule({
  declarations: [AppComponent, UrldecodePipe, QrScanComponent, TakePictureComponent, UseOtpComponent, MarkAttendanceComponent, AttendanceMarkedSuccessfullyComponent, ListOfClassesComponent, EditClassDetailsComponent, TakeAttendanceComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    ActionSheet,
    Network,
    StatusBar,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
