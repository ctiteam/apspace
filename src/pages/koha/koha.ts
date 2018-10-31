import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage, NavController } from 'ionic-angular';

import { CasTicketProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-koha',
  template: '',
})
export class KohaPage {

  kohaUrl = 'http://opac.apiit.edu.my/cgi-bin/koha/opac-user.pl';

  constructor(
    private cas: CasTicketProvider,
    private iab: InAppBrowser,
    private navCtrl: NavController,
  ) { }

  ionViewDidLoad() {
    this.cas.getST(this.kohaUrl)
      .subscribe(st => this.iab.create(`${this.kohaUrl}?ticket=${st}`, '_blank', 'location=true'));
    this.navCtrl.pop();
  }
}
