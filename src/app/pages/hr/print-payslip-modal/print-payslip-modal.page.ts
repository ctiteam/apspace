import { Component, OnInit } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { map, tap} from 'rxjs/operators';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'app-print-payslip-modal',
  templateUrl: './print-payslip-modal.page.html',
  styleUrls: ['./print-payslip-modal.page.scss'],
})
export class PrintPayslipModalPage implements OnInit {
  payslips = [];
  payslipsUrl = 'https://ztmu4mdu21.execute-api.ap-southeast-1.amazonaws.com';
  payslipsEndpoint = '/dev/staff/payslips';

  minDate;
  maxDate;

  selectedDate;

  constructor(
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private file: File,
    private transfer: FileTransfer,
    private fileOpener: FileOpener,
    private ws: WsApiService
  ) { }

  ngOnInit() {
    this.ws.get<any>(this.payslipsEndpoint, { url: this.payslipsUrl }).pipe(
      map(payslips => payslips.payslips),
      tap(payslips => this.payslips = payslips),
      tap(payslips => {
        const dates = [...payslips.map(payslip => payslip.split('.', 2)[1].replace('-End Month', ''))];
        this.minDate = dates[0];
        this.maxDate = dates[dates.length - 1];
      })
    ).subscribe();
  }

  generatePayslipPdf() {
    const downloadPayslipEndpoint = '/dev/staff/download_payslip/';
    const filteredSelectedDate = this.selectedDate.substring(0, 7);
    const fileName = this.payslips.find(element => element.includes(filteredSelectedDate));

    const transfer = this.transfer.create();

    if (this.platform.is('cordova')) {
      transfer.download(
        this.payslipsUrl + downloadPayslipEndpoint + fileName,
        this.file.dataDirectory + fileName
      ).then((entry) => {
        console.log('this is entry to url ', entry.toURL());
        this.fileOpener.open(entry.toURL(), 'application/pdf').then(() => {
          console.log('file is opened');
        }).catch(e => console.log('ERROR ERROR ', e));
      }, (error) => console.log('download error ', error));
    } else {
      window.open(this.payslipsUrl + downloadPayslipEndpoint + fileName);
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
