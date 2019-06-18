import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage, NavController } from 'ionic-angular';

import { CasTicketProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-graduations',
  template: '',
})
export class GraduationsPage {

  graduationsUrl = 'http://graduation-diploma.sites.apiit.edu.my/';

  constructor(
    private cas: CasTicketProvider,
    private iab: InAppBrowser,
    private navCtrl: NavController,
  ) { }

  ionViewDidLoad() {
    this.cas.getST(this.graduationsUrl)
      .subscribe(st => this.iab.create(`${this.graduationsUrl}?ticket=${st}`, '_blank', 'location=true'));
    this.navCtrl.pop();
  }
}
