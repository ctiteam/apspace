import { Component } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import { CasTicketService, WsApiService } from 'src/app/services';

@Component({
  selector: 'app-print-payslip-modal',
  templateUrl: './print-payslip-modal.page.html',
  styleUrls: ['./print-payslip-modal.page.scss'],
})

export class PrintPayslipModalPage {
  files$: Observable<any[]>;
  ePayslipUrl = 'https://t16rz80rg7.execute-api.ap-southeast-1.amazonaws.com/staging';
  // payslipsUrl = 'https://api.apiit.edu.my';

  dateToFilter;
  fileToFilter;
  term;
  isHumanResourceAdmin = true;
  search = false;
  whileFirstSearch = false;
  segmentValue = 'myFiles';

  constructor(
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
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
    this.files$ = this.ws.get<any>('/epayslip/list', { url: this.ePayslipUrl }).pipe(
      map(files => [...files.ea_form, ...files.payslips]),
      map(files => files.sort((a, b) => 0 - (a > b ? 1 : -1))),
      finalize(() => refresher && refresher.target.complete())
    );
  }

  downloadPayslipPdf(payslip) {
    const downloadPayslipEndpoint = '/epayslip/download/';
    const link = this.ePayslipUrl + downloadPayslipEndpoint + payslip;

    this.cas.getST(link).subscribe(st => {
      fetch(link + `?ticket=${st}`).then(result => result.blob()).then(blob => {
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });

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

  displayAllFiles() {
    this.dateToFilter = '';
    this.fileToFilter = '';
  }

  segmentChanged(event: any) {
    this.dateToFilter = '';
    this.fileToFilter = '';

    if (event.detail.value === 'myFiles') {
      this.doRefresh();
      this.search = false;
      this.whileFirstSearch = false;
    } else {
      this.files$ = of([]);
      this.search = true;
      this.whileFirstSearch = true;
    }
  }

  searchFiles() {
    if (this.whileFirstSearch) {
      this.whileFirstSearch = false;
    }

    this.files$ = this.ws.get<any>(`/epayslip/find?staff_id=${this.term}`, { url: this.ePayslipUrl }).pipe(
      map(files => [...files.ea_form, ...files.payslips]),
      map(files => files.sort((a, b) => 0 - (a > b ? 1 : -1))),
      catchError(error => of(error))
    );
  }

  syncFiles() {
    this.alertCtrl.create({
      header: 'Perform synchronize?',
      buttons: [
        {
          text: 'Yes',
          handler: _ => {
            this.presentLoading();
            this.ws.get<any>('/epayslip/sync', { url: this.ePayslipUrl }).subscribe({
              next: () => {
                this.presentAlert('Success!', 'Synchronized', 'The synchronize is done.', 'success-alert');
              },
              error: () => {
                this.dismissLoading();
                this.presentAlert('Alert!', 'Synchronize Failed.', 'The synchronize is failed.', 'danger-alert');
              },
              complete: () => {
                this.dismissLoading();
              }
            });
          }
        }, {
          text: 'No',
          role: 'cancel'
        }
      ]
    }).then(alert => alert.present());
  }

  presentAlert(header: string, subHeader: string, message: string, cssClass) {
    this.alertCtrl.create({
      cssClass,
      header,
      subHeader,
      message,
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  presentLoading() {
    this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Please wait...',
      translucent: true,
    }).then(loading => loading.present());
  }

  dismissLoading() {
    this.loadingCtrl.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
