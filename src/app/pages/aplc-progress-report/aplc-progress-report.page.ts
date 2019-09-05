import { Component } from '@angular/core';
import { CasTicketService } from 'src/app/services';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-aplc-progress-report',
  templateUrl: './aplc-progress-report.page.html',
  styleUrls: ['./aplc-progress-report.page.scss'],
})
export class AplcProgressReportPage {
  constructor(
    private cas: CasTicketService,
    private iab: InAppBrowser,
  ) { }

  openAdminReports() {
    const jasperUrl = 'https://report.apu.edu.my/jasperserver-pro/j_spring_security_check';
    this.cas.getST(jasperUrl).subscribe(st => {
      this.iab.create(`${jasperUrl}?ticket=${st}`, '_system', 'location=true');
    });
  }

}
