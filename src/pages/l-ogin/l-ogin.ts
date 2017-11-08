import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HOMEPage } from '../h-ome/h-ome';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser'

@Component({
  selector: 'page-l-ogin',
  templateUrl: 'l-ogin.html'
})
export class LOGINPage {

  constructor(public navCtrl: NavController, private inAppBrowser: InAppBrowser) {
    
  }

  url : string = "https://cas.apiit.edu.my/cas/login";

  openCas(url : string){
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }

  const browser = this.inAppBrowser.create(url, '_self', options)

  }
  goToHOME(params){
    if (!params) params = {};
    this.navCtrl.push(HOMEPage);
  }
}
