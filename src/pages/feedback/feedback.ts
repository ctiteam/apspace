import { Component } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';

import { FeedbackProvider, VersionProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  contactNo: string;
  message: string;
  platform: string;
  appVersion: string;

  submitting = false;

  readonly screenSize = screen.width + 'x' + screen.height;

  constructor(
    private feedback: FeedbackProvider,
    private toastCtrl: ToastController,
    private version: VersionProvider,
  ) { }

  submitFeedback() {
    this.submitting = true;
    const feedback = {
      contactNo: this.contactNo || "",
      platform: this.platform,
      message: this.message,
      appVersion: this.appVersion,
      screenSize: this.screenSize,
    };

    this.feedback.sendFeedback(feedback).subscribe(_ => {
    }, err => {
      this.toastCtrl.create({
        message: err.message,
        cssClass: 'danger',
        position: 'top',
        duration: 3000,
      }).present();
      // finally not invoked as error does not complete
      this.submitting = false;
    },
    () => {
      this.message = '';
      this.contactNo = '';
      this.toastCtrl.create({
        message: 'Feedback submitted!',
        position: 'top',
        duration: 3000,
      }).present();
      this.submitting = false;
    });
  }

  ionViewDidLoad() {
    this.platform = this.feedback.platform();
    this.appVersion = this.version.name;
  }

}
