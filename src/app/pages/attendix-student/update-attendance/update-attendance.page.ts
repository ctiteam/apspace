import {
  ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, ViewChild
} from '@angular/core';

import { UpdateAttendanceGQL } from './update-attendance.mutation';
import { Observable } from 'apollo-link';

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
  ) { }

  scanCode() {
    this.updateAttendance.mutate({ schedule: 'a', otp: this.otp, student: `TP${this.student++}` })
      .subscribe(d => console.log(d));
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

      this.updateAttendance.mutate({
        schedule: 'a',
        otp: this.otp,
        student: `TP${this.student++}`
      }).subscribe(d => {
        console.log(d);
        // clear value
        el.value = '';
        for (let prev = el; prev != null; prev = prev.previousElementSibling as HTMLInputElement) {
          prev.value = '';
          prev.focus();
        }
        this.otp = '';
      }, e => {
        console.error(e);
        // TODO: handle error
      });

    }
    // prevent change to value
    return false;
  }

  swapMode(ev: MouseEvent) {
    this.scan = !this.scan;
    this.cdr.detectChanges();
    if (this.otpInput) {
      this.otpInput.nativeElement.focus();
    }
  }

}
