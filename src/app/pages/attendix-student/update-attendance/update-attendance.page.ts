import {
  ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, ViewChild
} from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Observable } from 'rxjs';

import { UpdateAttendanceGQL } from '../../../../generated/graphql';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-update-attendance',
  templateUrl: './update-attendance.page.html',
  styleUrls: ['./update-attendance.page.scss'],
})
export class UpdateAttendancePage {

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
        this.updateAttendance.mutate({ otp: barcodeData.text })
          .subscribe(d => console.log(d), err => this.handleError(err));
      }
    }).catch(err => {
      console.error(err);
    });
  }

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

        this.updateAttendance.mutate({ otp }).subscribe(d => {
          this.toastCtrl.create({
            message: 'Attendance updated',
            duration: 2000,
            position: 'top',
            color: 'success'
          }).then(toast => toast.present());
          console.log(d);
          this.clear(el);
        }, err => {
          this.handleError(err);
          this.clear(el);
        });

      }
    } else if (ev.key === 'Backspace') {
      const prev = el.previousSibling as HTMLInputElement;
      prev.value = '';
      prev.focus();
    }
    // prevent change to value
    return false;
  }

  /** Handle error. */
  handleError(err: Error) {
    this.toastCtrl.create({
      message: 'Failed to update attendance. ' + err.message,
      duration: 2000,
      position: 'top',
      color: 'danger'
    }).then(toast => toast.present());
    console.error(err);
  }

  /** Clear otp value. */
  clear(el: HTMLInputElement) {
    el.value = '';
    for (let prev = el; prev != null; prev = prev.previousElementSibling as HTMLInputElement) {
      prev.value = '';
      prev.focus();
    }
  }

  /** Swap mode between auto scan and manual input. */
  swapMode(ev: MouseEvent) {
    this.scan = !this.scan;
    this.cdr.detectChanges();
    if (this.otpInput) {
      this.otpInput.nativeElement.focus();
    }
  }

}
