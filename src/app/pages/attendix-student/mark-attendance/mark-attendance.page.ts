import {
  ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, ViewChild
} from '@angular/core';

import { MarkAttendanceGQL } from './mark-attendance.mutation';
import { Observable } from 'apollo-link';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.page.html',
  styleUrls: ['./mark-attendance.page.scss'],
})
export class MarkAttendancePage {

  numbers = new Array(6);
  @ViewChild('otpInput') otpInput: ElementRef<HTMLInputElement>;

  otp = '';
  student = 100001;

  scan = false;  // scan code or type code
  qrScan$: Observable<number>;

  constructor(
    private cdr: ChangeDetectorRef,
    private markAttendance: MarkAttendanceGQL,
  ) { }

  scanCode() {
    this.markAttendance.mutate({ schedule: 'a', otp: this.otp, student: `TP${this.student++}` })
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

      this.markAttendance.mutate({
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
