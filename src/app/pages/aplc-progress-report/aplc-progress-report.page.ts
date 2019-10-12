import { Component } from '@angular/core';
import { CasTicketService } from 'src/app/services';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-aplc-progress-report',
  templateUrl: './aplc-progress-report.page.html',
  styleUrls: ['./aplc-progress-report.page.scss'],
})
export class AplcProgressReportPage {
  constructor(
    private cas: CasTicketService,
    private iab: InAppBrowser,
    private network: Network,
    private toastCtrl: ToastController
  ) { }

  openAdminReports() {
    const jasperUrl = 'https://report.apu.edu.my/jasperserver-pro/j_spring_security_check';
    if (this.network.type !== 'none') {
      this.cas.getST(jasperUrl).subscribe(st => {
        this.iab.create(`${jasperUrl}?ticket=${st}`, '_system', 'location=true');
      });
    } else {
      this.presentToast('External links cannot be opened in offline mode. Please ensure you have a network connection and try again');
    }
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      color: 'danger',
      duration: 6000,
      showCloseButton: true,
      position: 'top'
    });
    toast.present();
  }

}
