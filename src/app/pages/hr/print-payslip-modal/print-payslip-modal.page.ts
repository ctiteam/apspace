import { Component } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CasTicketService, WsApiService } from 'src/app/services';

@Component({
  selector: 'app-print-payslip-modal',
  templateUrl: './print-payslip-modal.page.html',
  styleUrls: ['./print-payslip-modal.page.scss'],
})

export class PrintPayslipModalPage {
  payslips$: Observable<[]>;
  payslipsUrl = 'https://ztmu4mdu21.execute-api.ap-southeast-1.amazonaws.com';
  payslipsEndpoint = '/dev/staff/payslips';

  constructor(
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private file: File,
    private transfer: FileTransfer,
    private fileOpener: FileOpener,
    private ws: WsApiService,
    private cas: CasTicketService
  ) { }

  ionViewWillEnter() {
    this.payslips$ = this.ws.get<any>(this.payslipsEndpoint, { url: this.payslipsUrl }).pipe(
      map(payslips => payslips.payslips)
    );
  }

  generatePayslipPdf(payslip) {
    const downloadPayslipEndpoint = '/dev/staff/download_payslip/';
    const link = this.payslipsUrl + downloadPayslipEndpoint + payslip;
    const transfer = this.transfer.create();

    if (this.platform.is('cordova')) {
      transfer.download(
        link,
        this.file.dataDirectory + payslip
      ).then((entry) => {
        console.log('this is entry to url ', entry.toURL());
        this.fileOpener.open(entry.toURL(), 'application/pdf').then(() => {
          console.log('file is opened');
        }).catch(e => console.log('ERROR ERROR ', e));
      }, (error) => console.log('download error ', error));
    } else {
      this.cas.getST(link).subscribe(st => {
        window.open(link + `?ticket=${st}`);
      });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
