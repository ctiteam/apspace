import { Component } from '@angular/core';
import { NavParams, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NotificationStatus } from 'src/app/interfaces/dingdong';
import { NotificationService } from 'src/app/services';

@Component({
  selector: 'app-dingdong-preferences',
  templateUrl: './dingdong-preferences.page.html',
  styleUrls: ['./dingdong-preferences.page.scss'],
})
export class DingdongPreferencesPage {

  isModal: true | false = false;
  isProcessing: true | false = false;
  isSubscribed: true | false = false;
  message: string;

  status$: Observable<NotificationStatus>;

  constructor(
    private params: NavParams,
    private toastCtrl: ToastController,
    private dingdong: NotificationService
  ) {
    this.isModal = this.params.get('isModal');
  }

  ionViewDidEnter() {
    this.status$ = this.dingdong.getSubscription()
      .pipe(
        tap(r => this.changeState(r.active))
      );
  }

  async sendToast(msg: string, success: true | false = true) {
    await this.toastCtrl.create({
      message: msg,
      position: 'top',
      color: success ? 'success' : 'danger',
      showCloseButton: true,
      duration: 3000
    }).then((toast) => toast.present());
  }

  changeState(value: boolean) {
    value
      ? this.message = 'By unsubscribing, you will no longer receive any future updates from us in your personal email.'
      : this.message = 'By subscribing, you will receive any future updates from us in your personal email.';
    this.isSubscribed = value;
  }

  onUnsubscribe() {
    this.isProcessing = true;
    this.dingdong.doUnsubscribe().subscribe(
      {
        next: (data) => {
          if (data.msg === 'success') {
            this.changeState(false); // Success! Change status to unsubscribed
            this.sendToast('Done! Successfully unsubscribed from Emails.');
          } else {
            this.sendToast('Aww! Unable to unsubscribed from Emails.', false);
          }
        },
        complete: () => {
          this.isProcessing = false;
        },
        error: () => {
          this.isProcessing = false;
        }
      }
    );
  }

  onSubscribe() {
    this.isProcessing = true;
    this.dingdong.doSubscribe().subscribe(
      {
        next: (data) => {
          if (data.msg === 'success') {
            this.changeState(true); // Success! Change status to subscribed
            this.sendToast('Done! Successfully subscribed to Emails.');
          } else {
            // Do not change state & send toast
            this.sendToast('Aww! Unable to subscribe to Emails.', false);
          }
        },
        complete: () => {
          this.isProcessing = false;
        },
        error: () => {
          this.isProcessing = false;
        }
      }
    );
  }
}
