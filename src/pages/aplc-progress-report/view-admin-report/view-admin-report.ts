import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage, NavController } from 'ionic-angular';

import { CasTicketProvider } from '../../../providers';

@IonicPage()
@Component({
  selector: 'page-view-admin-report',
  template: '',
})
export class ViewAdminReportPage {

  jasperUrl = 'https://report.apu.edu.my/jasperserver-pro/j_spring_security_check';

  constructor(
    private cas: CasTicketProvider,
    private iab: InAppBrowser,
    private navCtrl: NavController,
  ) { }

  ionViewDidLoad() {
    this.cas.getST(this.jasperUrl)
      .subscribe(st => this.iab.create(`${this.jasperUrl}?ticket=${st}`, '_blank', 'location=true'));
    this.navCtrl.pop();
  }
}
