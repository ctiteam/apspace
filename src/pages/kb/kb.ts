import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage, NavController } from 'ionic-angular';

import { CasTicketProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-kb',
  template: '',
})
export class KbPage {

  kbUrl = 'http://kb.sites.apiit.edu.my/home/';

  constructor(
    private cas: CasTicketProvider,
    private iab: InAppBrowser,
    private navCtrl: NavController,
  ) { }

  ionViewDidLoad() {
    this.cas.getST(this.kbUrl)
      .subscribe(st => this.iab.create(`${this.kbUrl}?ticket=${st}`, '_blank', 'location=true'));
    this.navCtrl.pop();
  }
}
