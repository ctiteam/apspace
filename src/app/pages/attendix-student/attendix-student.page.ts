import {
  ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild
} from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Observable } from 'rxjs';

import { UpdateAttendanceGQL } from '../../../generated/graphql';

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-attendix-student',
  templateUrl: './attendix-student.page.html',
  styleUrls: ['./attendix-student.page.scss'],
})
export class AttendixStudentPage implements OnInit {

  digits = new Array(3);
  @ViewChild('otpInput', { static: false }) otpInput: ElementRef<HTMLInputElement>;

  isOpen = false;

  status: QRScannerStatus;  // scan availability
  qrScan$: Observable<number>;

  constructor(
    private updateAttendance: UpdateAttendanceGQL,
    public barcodeScanner: BarcodeScanner,
    public qrScanner: QRScanner,
    public toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.qrScanner.prepare()
      .then(status => { this.status = status; console.log(status); })
      .catch(err => console.warn('QRScanner', err));
  }

  scanCode() {
    if (this.status.authorized) {
      console.log('scan');
      const scanSub = this.qrScanner.scan().subscribe((text: string) => {
        console.log('Scanned', text);
        this.sendOtp(text);
        this.qrScanner.hide();
        scanSub.unsubscribe();
      });
    } else if (this.status.denied) {
      // camera permission was permanently denied
      // you must use QRScanner.openSettings() method to guide the user to the settings page
      // then they can grant the permission from there
    } else {
      // permission was denied, but not permanently. You can ask for permission again at a later time.
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

  /** Clear otp value. */
  clear(el: HTMLInputElement) {
    el.value = '';
    for (let prev = el; prev != null; prev = prev.previousElementSibling as HTMLInputElement) {
      prev.value = '';
      prev.focus();
    }
  }

}
