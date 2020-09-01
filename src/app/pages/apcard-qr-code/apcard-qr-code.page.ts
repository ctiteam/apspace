import { Component, OnDestroy, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { WsApiService } from 'src/app/services';
import { DressCodeReminderModalPage } from './dress-code-reminder/dress-code-reminder-modal';
import { VisitHistoryModalPage } from './visit-history/visit-history-modal';

@Component({
  selector: 'app-apcard-qr-code',
  templateUrl: './apcard-qr-code.page.html',
  styleUrls: ['./apcard-qr-code.page.scss']
})
export class ApcardQrCodePage implements OnInit, OnDestroy {
  status: QRScannerStatus;  // scan availability

  loading: HTMLIonLoadingElement;

  scan: boolean;
  scanSub: Subscription;
  sending = false;

  constructor(
    private ws: WsApiService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    public qrScanner: QRScanner,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.scanQrCode();
  }

  ngOnDestroy() {
    if (this.scanSub) {
      this.scanSub.unsubscribe();
    }
    this.qrScanner.destroy();
  }

  scanQrCode() {
    this.qrScanner.prepare().then(status => {
      console.assert(status.authorized);
      this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
        if (this.sending) {
          return;
        } else {
          this.sendRequest(text);
        }
      });
      this.scan = true;
      this.qrScanner.show();
    }).catch(err => {
      this.scan = false;
      if (err === 'cordova_not_available') {
        // this.presentToast('QR scanner does not support web version of APSpace. It works only on the mobile app', 7000, 'danger');
      } else if (err.name === 'CAMERA_ACCESS_DENIED') {
        this.presentToast('Access Denied, please allow the app to access the camera to scan QR codes', 9000, 'warning');
        this.requestPerm();
      } else {
        this.presentToast(err, 7000, 'danger');
      }
    });
  }

  sendRequest(qrValue: string) {
    this.sending = true;
    this.presentLoading();
    if (qrValue !== 'apu-dress-code-reminder') {
      const body = {
        id_value: qrValue,
      };
      this.ws.post('/qr_code/check_in', { body }).subscribe(
        _ => { },
        err => {
          this.presentToast(`Error: ${err.error.error}`, 7000, 'danger');
          this.sending = false;
          this.scan = false;
          this.dismissLoading();
          this.scanSub.unsubscribe();
          this.qrScanner.destroy();
          this.navCtrl.back();
        },
        () => {
          this.dismissLoading();
          this.presentAlert('Confirm!', 'QR Code Scanned', `You have successfully scanned the QR code.`, 'success-alert');
          this.scan = false;
          this.sending = false;
          this.scanSub.unsubscribe();
          this.qrScanner.destroy();
          this.navCtrl.back();
        }
      );
    } else {
      this.openDressCodeReminderPage();
      // addd dress code page here and access it from here
    }

  }

  async presentAlert(header: string, subHeader: string, message: string, cssClass) {
    const alert = await this.alertCtrl.create({
      cssClass,
      header,
      subHeader,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async openDressCodeReminderPage() {
    const modal = await this.modalCtrl.create({
      component: DressCodeReminderModalPage,
      cssClass: 'custom-modal-style'
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  async viewHistory() {
    const modal = await this.modalCtrl.create({
      component: VisitHistoryModalPage,
      cssClass: 'custom-modal-style'
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  async presentToast(msg: string, duration: number, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      color,
      duration,
      position: 'top'
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

  /** Request for permission. */
  requestPerm() {
    this.alertCtrl.create({
      header: 'Permission denied',
      message: 'Please provide access to camera.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        },
        {
          text: 'Okay',
          handler: () => this.qrScanner.openSettings()
        }
      ]
    }).then(alert => alert.present());
  }
}
