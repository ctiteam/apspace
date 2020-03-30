import { Component, OnInit } from '@angular/core';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-print-payslip-modal',
  templateUrl: './print-payslip-modal.page.html',
  styleUrls: ['./print-payslip-modal.page.scss'],
})
export class PrintPayslipModalPage implements OnInit {

  constructor(
    public modalCtrl: ModalController,
    private platform: Platform,
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer
  ) { }

  ngOnInit() {
  }

  generatePayslipPdf() {
    const path = this.platform.is('ios') ? this.file.documentsDirectory : this.file.dataDirectory;

    const transfer = this.transfer.create();

    transfer.download(
      'https://ztmu4mdu21.execute-api.ap-southeast-1.amazonaws.com/dev/staff/download_payslip/U6942.2020-02-End Month.Payslip.PDF',
      path + 'myfile.pdf'
    ).then(entry => {
      const url = entry.toURL();
      this.document.viewDocument(url, 'application/pdf', {});
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
