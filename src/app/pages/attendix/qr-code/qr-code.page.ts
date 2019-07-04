import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
})
export class QrCodePage {

  constructor(private qrScanner: QRScanner) { }

  scanCode() {
    console.log('Scan start');

    this.qrScanner.getStatus().then((status) => {
      console.log(status);
    });

    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      console.log('Scan status', status);
      if (status.authorized) {
        // Grant Camera Permission

        // Start Scanning
        const scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log(text);

          this.qrScanner.hide(); // hide camera preview
          scanSub.unsubscribe(); // stop scanning
        });

        this.showCamera();

        this.qrScanner.resumePreview();

        // show camera preview
        this.qrScanner.show().then((data: QRScannerStatus) => {
          console.log('showing data', data.showing);
        }, err => {
          console.log('show error', err);
        });
      } else if (status.denied) {
        // Permission permanently denied
      } else {
        // Permission not permanently denied
      }
    }).catch((e: any) => console.log('Scan error is', e));
  }

  showCamera() {
    setTimeout(() => {
      window.document.querySelectorAll('ion-content').forEach(element => {
        const element1 = element.shadowRoot.querySelector('style');
        element1.innerHTML = element1.innerHTML.replace
          ('--background:var(--ion-background-color,#fff);', '--background: transparent');
      });
    }, 300);
  }

  hideCamera() {
    window.document.querySelectorAll('ion-content').forEach(element => {
      const element1 = element.shadowRoot.querySelector('style');
      element1.innerHTML = element1.innerHTML.replace
        ('--background:var(--ion-background-color,#fff);', '--background: transparent');
    });
  }
}
