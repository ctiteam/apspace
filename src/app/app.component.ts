import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NewsService } from './services/news.service';

import { HOMEPage } from '../pages/h-ome/h-ome';
import { TIMETABLEPage } from '../pages/t-imetable/t-imetable';
import { RESULTSPage } from '../pages/r-esults/r-esults';
import { FEESPage } from '../pages/f-ees/f-ees';
import { NOTIFICATIONPage } from '../pages/n-otification/n-otification';
import { FEEDBACKPage } from '../pages/f-eedback/f-eedback';
import { LOGINPage } from '../pages/l-ogin/l-ogin';




@Component({
  templateUrl: 'app.html',
  providers: [NewsService]
})

export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any = LOGINPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }


  goToHOME(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(HOMEPage);
  } goToTIMETABLE(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(TIMETABLEPage);
  } goToRESULTS(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(RESULTSPage);
  } goToFEES(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(FEESPage);
  } goToNOTIFICATION(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(NOTIFICATIONPage);
  } goToFEEDBACK(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(FEEDBACKPage);
  }
}
