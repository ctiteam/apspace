import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-webmail',
  template: '',
})
export class WebmailPage {

  webmailUrl = 'https://outlook.office.com/owa/?realm=mail.apu.edu.my';

  constructor(
    private iab: InAppBrowser,
    private navCtrl: NavController,
  ) { }

  ionViewDidLoad() {
    this.iab.create(`${this.webmailUrl}`, '_blank', 'location=true');
    this.navCtrl.pop();
  }
}
