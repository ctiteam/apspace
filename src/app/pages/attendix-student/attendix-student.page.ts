import {
  Component, ElementRef, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Observable, Subscription } from 'rxjs';

import { UpdateAttendanceGQL } from '../../../generated/graphql';

@Component({
  selector: 'app-attendix-student',
  templateUrl: './attendix-student.page.html',
  styleUrls: ['./attendix-student.page.scss'],
})
export class AttendixStudentPage implements OnInit, OnDestroy {

  digits = new Array(3);
  @ViewChild('otpInput', { static: false }) otpInput: ElementRef<HTMLInputElement>;

  isCordova: boolean;
  scan = false;

  status: QRScannerStatus;  // scan availability
  qrScan$: Observable<number>;
  scanSub: Subscription;

  constructor(
    private updateAttendance: UpdateAttendanceGQL,
    public alertCtrl: AlertController,
    public barcodeScanner: BarcodeScanner,
    public plt: Platform,
    public qrScanner: QRScanner,
    public toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.isCordova = this.plt.is('cordova');
    if (this.isCordova) {
      this.swapMode();
    }
  }

  ngOnDestroy() {
    // stop scan mode
    if (this.isCordova && this.scan) {
      this.swapMode();
    }
  }

  /** Swap mode between auto scan and manual input. */
  swapMode() {
    this.scan = !this.scan;
    if (this.scan) {
      this.qrScanner.prepare().then(status => {
        console.assert(status.authorized);
        // scanning only takes the first valid code
        this.scanSub = this.qrScanner.scan()
          .subscribe((text: string) => this.sendOtp(text));
        this.qrScanner.show();
      }).catch(err => {
        this.scan = false;
        if (err.name === 'CAMERA_ACCESS_DENIED') {
          this.requestPerm();
        } else {
          console.error('Unknown error', err.name);
        }
      });
    } else {
      this.scanSub.unsubscribe();
      this.qrScanner.destroy();
    }
  }

  /** Handle keydown event. */
  onKey(ev: KeyboardEvent): boolean {
    const el = ev.target as HTMLInputElement;
    if ('0' <= ev.key && ev.key <= '9') {
      el.value = ev.key;
      if (el.nextSibling) {
        (el.nextSibling as HTMLInputElement).focus();
      } else {
        let otp = '';
        for (let prev = el; prev != null; prev = prev.previousElementSibling as HTMLInputElement) {
          otp = prev.value + otp;
        }
        this.sendOtp(otp).then(() => this.clear(el));
      }
    } else if (ev.key === 'Backspace') {
      const prev = el.previousSibling as HTMLInputElement;
      prev.value = '';
      prev.focus();
    }
    // prevent change to value
    return false;
  }

  /** Send OTP. */
  sendOtp(otp: string): Promise<boolean> {
    return new Promise(res => {
      this.updateAttendance.mutate({ otp }).subscribe(d => {
        this.toast('Attendance updated', 'success');
        console.log(d);
        res(true);
      }, err => {
        this.toast('Failed to update attendance. ' + err.message.replace('GraphQL error: ', ''), 'danger');
        console.error(err);
        res(true);
      });
    });
  }

  /** Clear otp value. */
  clear(el: HTMLInputElement) {
    el.value = '';
    for (let prev = el; prev != null; prev = prev.previousElementSibling as HTMLInputElement) {
      prev.value = '';
      prev.focus();
    }
  }

  /** Toast helper. */
  toast(message: string, color: string) {
    this.toastCtrl.create({
      message,
      duration: 9000,
      position: 'top',
      color,
      showCloseButton: true
    }).then(toast => toast.present());
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
          handler: () => {}
        },
        {
          text: 'Okay',
          handler: () => this.qrScanner.openSettings()
        }
      ]
    }).then(alert => alert.present());
  }

}
