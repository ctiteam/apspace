import {
  ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, ViewChild
} from '@angular/core';
import { ToastController } from '@ionic/angular';
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

  otp = '';
  student = 100001;

  scan = false;  // scan code or type code
  qrScan$: Observable<number>;

  constructor(
    private cdr: ChangeDetectorRef,
    private updateAttendance: UpdateAttendanceGQL,
    public toastCtrl: ToastController
  ) { }

  scanCode() {
    this.updateAttendance.mutate({ otp: this.otp })
      .subscribe(d => console.log(d), err => this.handleError(err));
  }

  onKey(ev: KeyboardEvent): boolean {
    // ignore non-digits
    if (ev.key < '0' || ev.key > '9') {
      return false;
    }
    const el = ev.target as HTMLInputElement;
    el.value = ev.key;
    if (el.nextSibling) {
      (el.nextSibling as HTMLInputElement).focus();
    } else {
      this.otp = '';
      for (let prev = el; prev != null; prev = prev.previousElementSibling as HTMLInputElement) {
        this.otp = prev.value + this.otp;
      }

      this.updateAttendance.mutate({ otp: this.otp }).subscribe(d => {
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
    this.otp = '';
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
