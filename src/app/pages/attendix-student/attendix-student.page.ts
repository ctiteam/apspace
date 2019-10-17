import {
  ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, ViewChild
} from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Observable } from 'rxjs';

import { UpdateAttendanceGQL } from '../../../generated/graphql';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-attendix-student',
  templateUrl: './attendix-student.page.html',
  styleUrls: ['./attendix-student.page.scss'],
})
export class AttendixStudentPage {

  digits = new Array(3);
  @ViewChild('otpInput', { static: false }) otpInput: ElementRef<HTMLInputElement>;

  student = 100001;

  scan = false;  // scan code or type code
  qrScan$: Observable<number>;

  constructor(
    private cdr: ChangeDetectorRef,
    private updateAttendance: UpdateAttendanceGQL,
    public barcodeScanner: BarcodeScanner,
    public toastCtrl: ToastController
  ) { }

  scanCode() {
    this.barcodeScanner.scan({ formats: 'QR_CODE', orientation: 'portrait' }).then(barcodeData => {
      if (!barcodeData.cancelled && barcodeData.format === 'QR_CODE') {
        this.sendOtp(barcodeData.text);
      }
    }).catch(err => {
      console.error(err);
    });
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
        this.toast('Failed to update attendance. ' + err.message, 'danger');
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
