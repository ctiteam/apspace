import { Component } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { CasTicketService, WsApiService } from 'src/app/services';

@Component({
  selector: 'app-print-payslip-modal',
  templateUrl: './print-payslip-modal.page.html',
  styleUrls: ['./print-payslip-modal.page.scss'],
})

export class PrintPayslipModalPage {
  payslips$: Observable<[]>;
  // payslipsUrl = 'https://ztmu4mdu21.execute-api.ap-southeast-1.amazonaws.com';
  payslipsUrl = 'https://api.apiit.edu.my';
  payslipsEndpoint = '/staff/payslips';

  constructor(
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private ws: WsApiService,
    private cas: CasTicketService
  ) { }

  ionViewWillEnter() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.payslips$ = this.ws.get<any>(this.payslipsEndpoint).pipe(
      map(payslips => payslips.payslips.sort((a, b) => 0 - (a > b ? 1 : -1))),
      finalize(() => refresher && refresher.target.complete())
    );
  }

  downloadPayslipPdf(payslip) {
    const downloadPayslipEndpoint = '/staff/download_payslip/';
    const link = this.payslipsUrl + downloadPayslipEndpoint + payslip;

    this.cas.getST(link).subscribe(st => {
      fetch(link + `?ticket=${st}`).then(result => result.blob()).then(blob => {
        const pdfBlob = new Blob([blob], {type: 'application/pdf'});

        if (this.platform.is('cordova')) {
          // Save the PDF to the data Directory of our App
          this.file.writeFile(this.file.dataDirectory, `${payslip}.pdf`, pdfBlob, { replace: true }).then(_ => {
            // Open the PDf with the correct OS tools
            this.fileOpener.open(this.file.dataDirectory + `${payslip}.pdf`, 'application/pdf');
          });
        } else {
          const blobUrl = URL.createObjectURL(pdfBlob);
          const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

          a.href = blobUrl;
          a.download = payslip;
          document.body.appendChild(a);
          a.click();

          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
          }, 5000);
        }
      });
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
