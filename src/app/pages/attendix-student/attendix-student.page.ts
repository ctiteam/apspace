import {
  Component, ElementRef, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';

import { Vibration } from '@ionic-native/vibration/ngx';
import { UpdateAttendanceGQL } from '../../../generated/graphql';
import { SettingsService } from '../../services';

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
  sending = false;

  status: QRScannerStatus;  // scan availability
  qrScan$: Observable<number>;
  scanSub: Subscription;

  constructor(
    private updateAttendance: UpdateAttendanceGQL,
    private settings: SettingsService,
    public alertCtrl: AlertController,
    public plt: Platform,
    public qrScanner: QRScanner,
    public toastCtrl: ToastController,
    public vibration: Vibration
  ) { }

  ngOnInit() {
    this.isCordova = this.plt.is('cordova');
    // first run and if scan is selected
    if (this.isCordova && this.settings.get('scan') !== false) {
      this.swapMode();
    }
  }

  ionViewDidEnter() {
    this.otpInput.nativeElement.focus();
  }

  ngOnDestroy() {
    // stop scan mode
    if (this.isCordova && this.scan) {
      this.swapMode();
    }
  }

  /** Swap mode between auto scan and manual input. */
  swapMode() {
    this.settings.set('scan', this.scan = !this.scan);
    if (this.scan) {
      this.qrScanner.prepare().then(status => {
        console.assert(status.authorized);
        // scanning only takes the first valid code
        this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
          if (this.sending) {
            return;
          } else if (text.length === this.digits.length) {
            this.sendOtp(text);
          } else {
            this.toast(`Invalid OTP (should be ${this.digits.length} digits)`, 'danger');
          }
        });
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

  /** Handle keydown and keyup event, detect key input by value in target, prevent key spam. */
  onKey(ev: KeyboardEvent): boolean {
    const el = ev.target as HTMLInputElement;
    // do not process key when sending (ignore key spamming)
    if (this.sending) {
      // prevent double input for last input on older browsers
      el.value = el.value.slice(0, 1);
      return false;
    }
    // ev.key not usable in UC browser fallback
    // get the value from element instead of event
    if ('0' <= el.value && el.value <= '9') {
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
      if (ev.type === 'keyup') { // ignore backspace on keyup
        return true;
      } else if (!el.nextSibling && el.value) { // last input not empty
        el.value = '';
      } else {
        const prev = el.previousSibling as HTMLInputElement;
        prev.value = '';
        prev.focus();
      }
    } else { // invalid character not handled by older browsers html
      el.value = '';
    }
    // prevent change to value
    return '0' <= ev.key && ev.key <= '9' && el.value.length === 0;
  }

  /** Send OTP. */
  sendOtp(otp: string): Promise<boolean> {
    console.assert(otp.length === this.digits.length);
    return new Promise(res => {
      this.sending = true;
      this.updateAttendance.mutate({ otp }).subscribe(d => {
        this.sending = false;
        // Vibrator (Vibrate til death!)
        this.vibration.vibrate(1000);
        this.toast('Attendance updated', 'success');
        console.log(d);
        res(true);
      }, err => {
        this.sending = false;
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
