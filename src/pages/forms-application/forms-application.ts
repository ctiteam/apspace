import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage, NavController } from 'ionic-angular';

import { CasTicketProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-forms-application',
  template: '',
})
export class FormsApplicationPage {

  formsApplicationUrl = 'http://forms.sites.apiit.edu.my/';

  constructor(
    private cas: CasTicketProvider,
    private iab: InAppBrowser,
    private navCtrl: NavController,
  ) { }

  ionViewDidLoad() {
    this.cas.getST(this.formsApplicationUrl)
      .subscribe(st => this.iab.create(`${this.formsApplicationUrl}?ticket=${st}`, '_blank', 'location=true'));
    this.navCtrl.pop();
  }
}
